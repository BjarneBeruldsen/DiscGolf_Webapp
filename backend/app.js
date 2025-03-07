//Authors: Bjarne Beruldsen & Laurent Zogaj

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nocache = require('nocache');
const compression = require('compression');
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require ('bcryptjs');
const MongoStore = require('connect-mongo');
const { kobleTilDB, getDb } = require('./db'); 
const { ObjectId } = require('mongodb');    
const PORT = process.env.PORT || 8000;
const path = require('path');
require('dotenv').config();

const app = express();

//https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set("trust proxy", 1); //Heroku kjører proxy og må settes til trust for at ulike ting skal fungere ordentlig som express-rate-limit (IP) og session

app.disable('x-powered-by'); //Disabled for sikkerhet da man kan se hvilken teknologi som brukes 

//https://expressjs.com/en/advanced/best-practice-performance.html
//https://github.com/expressjs/compression#readme
//Brukes for gzip komprimering. Fant ut av dette med chrome dev tools og lighthouse, og det ble da anbefalt å bruke dette for å øke ytelsen
app.use(compression());

//NoCache Sikrer at nettleserer ikke lagrer cache for sensitive data/sider
//https://github.com/helmetjs/nocache
//https://ivanpiskunov.medium.com/a-little-bit-about-node-js-security-by-hands-17470dddf4d0 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

app.use("/Innlogging", nocache());  
app.use("/Utlogging", nocache());   
app.use("/SletteBruker", nocache()); 
app.use("/Registrering", nocache());
app.use("/sjekk-session", nocache());

app.use(cors({
    origin: ["https://disk-applikasjon-39f504b7af19.herokuapp.com", "http://localhost:3000"], 
    credentials: true,
}));

//Default Helmet konfigurasjon med litt konfigurasjoner for at bilder vi bruker skal lastes opp riktig og fremtidig ressurser https://helmetjs.github.io/ & https://github.com/helmetjs/helmet
//Må nok endres etterhvert når kart/vær osv legges til
app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: [
            "'self'",
            "https://images.unsplash.com",
            "https://zewailcity.edu.eg",
            "https://zcadminpanel.zewailcity.edu.eg",
          ],
          frameSrc: [
            "'self'",
            "https://www.yr.no", 
          ],
          upgradeInsecureRequests: [],
        },
      },
    })
  );

app.use(express.json());

//Deployment under
//Legger serving fra statiske filer fra REACT applikasjonen
app.use(express.static(path.join(__dirname, '../frontend/build')));

//Konfigurasjon av session https://www.geeksforgeeks.org/how-to-handle-sessions-in-express/ & https://expressjs.com/en/resources/middleware/session.html  
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,                       //Lagrer session på hver request selv om ingen endringer er gjort
    saveUninitialized: false,            //Lagrer session selv uten ny data 
    proxy: process.env.NODE_ENV === 'production', //Må være true for at Heroku skal funke eller settes til production
    rolling: false,                      //Fornyer session ved hvert request, ikke vits forholder oss til maxAge
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), //Lagrer session i MongoDB                          
    cookie: {
        secure: process.env.NODE_ENV === 'production', //Må være true for at cookies skal fungere på nettsiden og false dersom siden skal funke lokalt, eller settes til production
        httpOnly: process.env.NODE_ENV === 'production', //Må være false når man tester lokalt og true ellers. Eller settes til production
        sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax", //Må være strict for at cookies skal fungere på nettsiden, sett den til "lax" for at siden skal funke lokalt
        maxAge: 1000 * 60 * 60 * 24,    //1 dag
    }
}));

//Initialisering av Passport.js og session
app.use(passport.initialize());
app.use(passport.session());

//Oppkobling mot databasen 
let db
kobleTilDB((err) => {
    if(!err) {
        db = getDb();

//Konfigurasjon av Passport.js https://www.passportjs.org/concepts/authentication/password/
passport.use(
    new LocalStrategy({ usernameField: "brukernavn", passwordField: "passord" }, 
    async (brukernavn, passord, done) => {  
        try {
            //Sjekker om brukeren finnes i databasen (brukernavn eller e-post)
            const funnetBruker = await db.collection("Brukere").findOne({
                $or: [
                    { brukernavn: brukernavn.trim().toLowerCase() },  
                    { epost: brukernavn.trim().toLowerCase() } 
                ]
            });
            //Hvis brukeren ikke finnes, returneres det en feilmelding
            if (!funnetBruker) {                                                                                                      
                return done(null, false, { message: "Brukernavn eller e-post ikke funnet" });
            }
            //Sjekker om passordet er riktig
            const passordSjekk = await bcrypt.compare(passord, funnetBruker.passord);
            if (!passordSjekk) {
                return done(null, false, { message: "Feil passord eller brukernavn" });
            }
            //Hvis innloggingen er vellykket, returnerer vi brukeren
            return done(null, funnetBruker);
        } catch (err) {
            //Returnerer en feil hvis noe går galt
            return done(err);
        }
    })
);
//Serialiserer brukeren ved å lagre brukerens ID i session
passport.serializeUser((bruker, done) => {
    done(null, bruker._id);
});
//Deserialiserer brukeren ved å hente brukerdata fra databasen basert på ID
passport.deserializeUser(async (id, done) => {
    try {
        //Konverterer ID til ObjectId 
        const objectId = new ObjectId(String(id)); 
        //Henter brukeren fra databasen
        const bruker = await db.collection("Brukere").findOne({ _id: objectId });
        //Hvis brukeren ikke finnes, returnerer vi en feilmelding
        if (!bruker) {
            return done(null, false, { message: "Bruker ikke funnet" });
        }
        //Returnerer brukeren hvis den finnes
        done(null, bruker);
    } catch (err) {
        //Logger og returnerer feil hvis noe går galt
        console.error("Feil under deserialisering:", err);
        done(err);
    }
});

//Start av server
app.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});
    } else {
        console.error("Feil ved oppkobling til databasen", err);
    }
});

//Klubbhåndterings ruter 
app.get('/klubber', (req, res) => {
    let klubber = []
    db.collection('Klubb')
    .find()
    .forEach(klubb => klubber.push(klubb))
    .then(() => {
        res.status(200).json(klubber)
    })
    .catch(() => {
        res.status(500).json({error: 'Feil ved henting av klubber'})
    })
})

app.get('/klubber/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'})
    }
    else {
        db.collection('Klubb')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved henting av klubb'})
        })
    }
})

app.post('/klubber', (req, res) => {
    const klubb = req.body

    db.collection('Klubb')
    .insertOne(klubb)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Feil ved lagring av klubb'})  
    })
})

app.delete('/klubber/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'})
    }
    else {
        db.collection('Klubb')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved sletting av klubb'})
        })
    }
})

app.patch('/klubber/:id', (req, res) => {
    const oppdatering = req.body

    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'})
    }
    else {
        db.collection('Klubb')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: oppdatering})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved sletting av klubb'})
        })
    }
})

//Rute som legger nyheter til klubben sin klubbside
app.post('/klubber/:id/nyheter', (req, res) => {
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const nyNyhet = {...req.body, _id: new ObjectId()};
        db.collection('Klubb')
        .updateOne(
            { _id: new ObjectId(req.params.id) },
            { $push: { nyheter: nyNyhet } }
        )
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved lagring av nyhet'});
        });
    }
});

//rute som legger til bane til git klubb
app.post('/klubber/:id/baner', (req, res) => {
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const nyBane = { ...req.body, _id: new ObjectId() };
        db.collection('Klubb')
        .updateOne(
            { _id: new ObjectId(req.params.id) },
            { $push: { baner: nyBane } }
        )
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved lagring av bane'});
        });
    }
});



//rute for henting av alle nyheter
app.get('/nyheterListe', (req, res) => {
    let nyheter = []; 
    db.collection('Klubb')
    .find()
    .forEach(klubb => {
        if(klubb.nyheter) {
            klubb.nyheter.forEach(nyhet => nyheter.push(nyhet));
        }
    })
    .then(() => {
        res.status(200).json(nyheter);
    })
    .catch(() => {
        res.status(500).json({error: 'Feil ved henting av nyheter'});
    });
})


//rute for henting av alle baner 
app.get('/banerListe', (req, res) => {
    let baner = []; 
    db.collection('Klubb')
    .find()
    .forEach(klubb => {
        if(klubb.baner) {
            klubb.baner.forEach(bane => baner.push(bane));
        }
    })
    .then(() => {
        res.status(200).json(baner);
    })
    .catch(() => {
        res.status(500).json({error: 'Feil ved henting av baner'});
    }); 
})

//rute for henting av spesifikk bane 
app.get('/baner/:id', async (req, res) => {
    try {
        const baneId = new ObjectId(req.params.id);
        const klubb = await db.collection('Klubb').findOne({ 'baner._id': baneId }, { projection: { 'baner.$': 1 } });
        
        if (!klubb) {
            return res.status(404).json({ error: 'Bane ikke funnet' });
        }

        const bane = klubb.baner[0];
        const response = {
            ...bane,
            klubbId: klubb._id 
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Feil ved henting av bane' });
    }
});

//Brukerhåndterings ruter

//Rute for å lagre poengkort for en bruker
app.post('/brukere/:id/poengkort', beskyttetRute, async (req, res) => {
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const poengkort = req.body

        db.collection('Brukere')
        .updateOne(
            { _id: new ObjectId(req.params.id) }, 
            { $push: { poengkort: poengkort } },
        )
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved lagring av poengkort'})
        })
    }
})

//Registrering av bruker
//Rate limit for å stoppe brute force angrep https://www.npmjs.com/package/express-rate-limit
const registreringStopp = rateLimit({
    windowMs: 60 * 60 * 1000, //1 time 
    max: 10, //Maks 10 registreringsforsøk fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});
//Validering av registrering med express-validator: https://express-validator.github.io/docs/
const registreringValidering = [
    body('brukernavn')
        .trim()
        .isLength({ min: 3, max: 15 }).withMessage("Brukernavnet må være mellom 3 og 15 tegn.")
        .isAlphanumeric().withMessage("Brukernavnet kan bare inneholde bokstaver og tall."),
    body('passord')
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
        .matches(/[A-Z]/).withMessage("Passordet må inneholde minst en stor bokstav.")
        //.matches(/[0-9]/).withMessage("Passordet må inneholde minst ett tall.") //Ikke gyldig med passord for admin/test for prosjektet
        .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn."),
    body('epost')
        .trim()
        .isEmail().withMessage("E-post må være gyldig.")
        .normalizeEmail() 
];
//Rute for registrering av bruker
app.post("/Registrering", registreringValidering, registreringStopp, async (req, res) => {
    try {
        const { brukernavn, passord, epost } = req.body;
        //Sjekker om brukernavn eller e-post allerede finnes i databasen
        const funnetBruker = await db.collection("Brukere").findOne({
            $or: [
                { brukernavn: brukernavn.trim().toLowerCase() }, 
                { epost: epost.trim().toLowerCase() }
            ]
        });
        //Returnerer feil hvis brukernavn eller e-post er i bruk
        if (funnetBruker) {
            console.log(`Registrering mislyktes: Brukernavn eller e-post (${brukernavn}, ${epost}) allerede i bruk.`);
            return res.status(400).json({ error: "Brukernavn eller e-post allerede registrert" });
        }
        //Kryptering av passord
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passord, salt);
        //Lagrer ny bruker i databasen
        const nyBruker = {
            brukernavn: brukernavn.trim().toLowerCase(),
            passord: hashedPassword,
            epost: epost.trim().toLowerCase(),
        };
        //Lagrer brukeren i databasen
        const result = await db.collection("Brukere").insertOne(nyBruker);
        //Logging
        console.log(`Bruker registrert: ${brukernavn}, e-post: ${epost}, ID: ${result.insertedId}`);
        return res.status(201).json({ message: "Bruker registrert" });
    } catch (err) {
        console.log("Feil ved registrering:", err.message);
        res.status(500).json({ error: "Feil ved registrering" });
    }
});
//Innlogging av bruker
//Rate limit for å stoppe brute force angrep https://www.npmjs.com/package/express-rate-limit
const loggeInnStopp = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutter
    max: 10, //Maks 10 logg inn fra samme IP
    message: { error: "For mange innloggingsforsøk, prøv igjen senere" },
});
//Validering av innlogging med express-validator https://express-validator.github.io/docs/
const innloggingValidering = [
    body('brukernavn')
        .trim()
        .notEmpty().withMessage("Brukernavn eller e-post må fylles ut.")
        .custom((value) => {
            const erBrukernavn = /^[a-zA-Z0-9]{3,15}$/.test(value);
            const erEpost = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!erBrukernavn && !erEpost) {
                throw new Error("Må være brukernavn (3-15 tegn) eller en gyldig e-post.");
            }
            return true;
        }),
    body('passord')
        .notEmpty().withMessage("Passord må fylles ut.") 
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
];
//Rute for innlogging
app.post("/Innlogging", loggeInnStopp, innloggingValidering, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Innlogging feilet", errors.array());
        return res.status(400).json({ errors: errors.array() }); 
    }
    //Bruker Passport for autentisering
    passport.authenticate("local", (err, bruker, info) => {
        if (err) {
            console.error("Innloggingsfeil:", err);
            return next(err);
        }
        //Sjekker om brukeren ble funnet
        if (!bruker) {
            console.warn("Innlogging mislyktes: ", info.message);
            return res.status(400).json({ error: info.message });
        }
        //Logger inn brukeren og lagrer session
        req.logIn(bruker, (err) => {
            if (err) {
                console.error("Feil ved session lagring:", err);
                return next(err);
            }
            //Beholder e-post og brukernavn
            const brukerUtenPassord = { 
                id: bruker._id.toString(), 
                brukernavn: bruker.brukernavn,
                epost: bruker.epost 
            };
            //Logging
            console.log(`Bruker logget inn: ${brukerUtenPassord.brukernavn}, e-post: ${brukerUtenPassord.epost}`);
            console.log(`Session aktiv med ID: ${req.sessionID}`);
            return res.status(200).json({
                message: "Innlogging vellykket",
                sessionID: req.sessionID,
                bruker: brukerUtenPassord
            });
        });
    })(req, res, next);
});

//Utlogging
app.post("/Utlogging", beskyttetRute, async (req, res) => {
    try {
        //Sjekker om brukeren er logget inn
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "Ingen aktiv session" });
        }
        //Henter brukernavn og e-post for logging 
        const brukernavn = req.user ? req.user.brukernavn : "Ukjent bruker";
        const epost = req.user ? req.user.epost : "Ukjent e-post";
        //Utfører utlogging
        req.logout((err) => {
            if (err) {
                console.error("Feil ved utlogging:", err);
                return res.status(500).json({ error: "Feil ved utlogging" });
            }
            //Sletter brukerens session
            req.session.destroy((err) => {
                if (err) {
                    console.error("Feil ved sletting av session:", err);
                    return res.status(500).json({ error: "Feil ved sletting av session" });
                }
                //Fjerner session-cookie fra klienten
                res.clearCookie("connect.sid", { path: "/" });
                console.log(`Session er nå slettet, utlogging fullført: ${brukernavn}, e-post: ${epost}`);
                return res.status(200).json({ message: "Utlogging vellykket, session slettet" });
            });
        }); //Logging
    } catch (error) {
        console.error("Uventet feil ved utlogging:", error);
        res.status(500).json({ error: "Serverfeil" });
    }
});
//Validering av innlogging med express-validator https://express-validator.github.io/docs/
const sletteValidering = [
    body("brukerInput")
        .trim()
        .notEmpty().withMessage("Brukernavn eller e-post må fylles ut.")
        .custom((value) => {
            if (!/^[a-zA-Z0-9]{3,15}$/.test(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { //Custom for både brukernavn og epost i en validering
                throw new Error("Må være brukernavn (3-15 tegn) eller en gyldig e-post.");
            }
            return true;
        }),
    body("passord")
        .notEmpty().withMessage("Passord må fylles ut.")
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
];
//Sletting av bruker
app.post("/SletteBruker", beskyttetRute, sletteValidering, async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Ingen aktiv session" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { brukerInput, passord } = req.body;
        //Finner bruker enten via brukernavn eller e-post
        const bruker = await db.collection("Brukere").findOne({
            $or: [{ brukernavn: brukerInput.toLowerCase() }, { epost: brukerInput.toLowerCase() }]
        });
        if (!bruker) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }
        //Sjekker passord
        const passordSjekk = await bcrypt.compare(passord, bruker.passord);
        if (!passordSjekk) {
            return res.status(401).json({ error: "Feil passord" });
        }
        //Sletter bruker 
        const objectId = new ObjectId(String(bruker._id));
        const slettet = await db.collection("Brukere").deleteOne({ _id: objectId });
        if (slettet.deletedCount === 0) {
            return res.status(500).json({ error: "Kunne ikke slette brukeren" });
        }
        console.log(`Bruker slettet: ${bruker.brukernavn}, e-post: ${bruker.epost}, ID: ${bruker._id}`);
        //Logger ut og sletter session/cookie
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: "Feil ved utlogging" });
            }
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: "Feil ved sletting av session" });
                }
                res.clearCookie("connect.sid", { path: "/" });
                console.log("Session og cookies er nå slettet.");
                return res.status(200).json({ message: "Bruker slettet og logget ut" });
            });
        }); //Logging
    } catch (error) {
        console.error("Feil ved sletting av bruker:", error);
        res.status(500).json({ error: "Serverfeil", details: error.message });
    }
});

//Endring av brukerinfo






//Sjekk av session
app.get("/sjekk-session", async (req, res) => {
    //Sjekker om brukeren er logget inn
    if (req.isAuthenticated()) {
        try {
            //Henter brukerdata fra databasen via bruker ID
            const bruker = await db.collection("Brukere").findOne({ _id: req.user._id });
            if (!bruker) {
                return res.status(404).json({ error: "Bruker ikke funnet" });
            }
            //Returnerer brukerdata 
            return res.status(200).json({
                bruker: {
                    id: bruker._id,
                    brukernavn: bruker.brukernavn,
                    epost: bruker.epost,
                    poengkort: bruker.poengkort //Legg til poengkort her
                },
            });
        } catch (err) { //Logging
            return res.status(500).json({ error: "Feil ved henting av brukerdata" });
        }
    } //Logging
    return res.status(401).json({ error: "Ingen aktiv session" });
});

//Sjekk for å beskytte ulike api-ruter
function beskyttetRute(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); //Brukeren er logget inn
    }
    res.status(401).json({ error: "Du må være logget inn for å få tilgang." });
}

//Andre ruter
//Tilbakestille testdata fra klubb collection 
app.delete('/tommeTestdata', (req, res) => {
    db.collection('Klubb').deleteMany({})
        .then(result => {
            res.status(200).json({ message: 'Testdata tømt' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Feil ved tømming av testdata' });
        });
});

// Håndter alle andre ruter med React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
