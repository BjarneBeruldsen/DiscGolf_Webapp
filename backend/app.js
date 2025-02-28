//Authors: Bjarne Beruldsen & Laurent Zogaj

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nocache = require('nocache');
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

//NoCache Sikrer at nettleserer ikke lagrer cache for sensitive data/sider
//https://github.com/helmetjs/nocache
//https://ivanpiskunov.medium.com/a-little-bit-about-node-js-security-by-hands-17470dddf4d0 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

app.use("/Innlogging", nocache());  
app.use("/Utlogging", nocache());   
app.use("/SletteBruker", nocache()); 
app.use("/Registrering", nocache());
app.use("/Sjekk-session", nocache());

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


//Konfigurasjon av session      https://www.geeksforgeeks.org/how-to-handle-sessions-in-express/ & https://expressjs.com/en/resources/middleware/session.html  
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,                       //Lagrer session på hver request selv om ingen endringer er gjort
    saveUninitialized: false,            //Lagrer session selv uten ny data 
    proxy: true,                         //Må være true for at Heroku skal funke
    rolling: false,                       //Fornyer session ved hvert request, ikke vits forholder oss til maxAge
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), //Lagrer session i MongoDB                          
    cookie: {
        secure: true,                    //Må være true for at cookies skal fungere på nettsiden og false dersom siden skal funke lokalt
        httpOnly: true,                  //Må være false når man tester lokalt og true ellers
        sameSite: "strict",             //Må være strict for at cookies skal fungere på nettsiden, sett den til "lax" for at siden skal funke lokalt
        maxAge: 1000 * 60 * 60 * 24,    //1 dag
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//Oppkobling mot databasen 
let db
kobleTilDB((err) => {
    if(!err) {
        db = getDb();


//Konfigurasjon av Passport.js
passport.use(
    new LocalStrategy({ usernameField: "bruker", passwordField: "passord" }, 
    async (bruker, passord, done) => {
        try {
            const funnetBruker = await db.collection("Brukere").findOne({ 
                $or: [
                    { bruker: bruker.trim().toLowerCase() }, 
                    { epost: bruker.trim().toLowerCase() }
                ]
            });
            if (!funnetBruker) {                                                                                                      
                return done(null, false, { message: "Brukernavn eller e-post ikke funnet" });
            }                                                                                   //https://www.passportjs.org/concepts/authentication/password/
            const passordSjekk = await bcrypt.compare(passord, funnetBruker.passord);
            if (!passordSjekk) {
                return done(null, false, { message: "Feil passord eller brukernavn" });
            }
            return done(null, funnetBruker);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((bruker, done) => {
    done(null, bruker._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const objectId = new ObjectId(String(id)); 
        const bruker = await db.collection("Brukere").findOne({ _id: objectId });
        if (!bruker) {
            return done(null, false, { message: "Bruker ikke funnet" });
        }
        done(null, bruker);
    } catch (err) {
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
        const nyNyhet = req.body;
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
        const nyBane = req.body;
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

//Brukerhåndterings ruter

//Registrering av bruker
//Rate limit for å stoppe brute force angrep https://www.npmjs.com/package/express-rate-limit
const registreringStopp = rateLimit({
    windowMs: 60 * 60 * 1000, //1 time 
    max: 10, //Maks 10 registreringsforsøk fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

//Validering av registrering med express-validator: https://express-validator.github.io/docs/
const registreringValidering = [
    body('bruker')
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
    console.log("Mottatt registrering:", req.body);

    try {
        const { bruker, passord, epost } = req.body;
        
        const funnetBruker = await db.collection("Brukere").findOne({ 
            $or: [{ bruker: bruker.trim().toLowerCase() }, { epost: epost.trim().toLowerCase() }] 
        });
        
        if (funnetBruker) {
            return res.status(400).json({ error: "Brukernavn eller e-post allerede registrert" });
        }

        //Kryptering av passord med bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passord, salt);

        //Lagrer ny bruker i databasen
        const nyBruker = { 
            bruker: bruker.trim().toLowerCase(), 
            passord: hashedPassword, 
            epost: epost.trim().toLowerCase(),
        };
        await db.collection("Brukere").insertOne(nyBruker);
        res.status(201).json({ message: "Bruker registrert" });
    } catch (err) {
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
    body('bruker')
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
app.post("/Innlogging", loggeInnStopp, innloggingValidering, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }
    passport.authenticate("local", (err, bruker, info) => {
        if (err) return next(err);
        if (!bruker) return res.status(400).json({ error: info.message });
        req.logIn(bruker, (err) => {
            if (err) return next(err);
            
            // Fjerner passord fra innlogget bruker men tar med epost slik at den er synlig i medlemskap blant annet. 
            const brukerUtenPassord = { 
                id: bruker._id, 
                bruker: bruker.bruker,
                epost: bruker.epost 
            };
            return res.status(200).json({
                message: "Innlogging vellykket",
                bruker: brukerUtenPassord,
            });
        });
    })(req, res, next);
});

//Utlogging
app.post("/Utlogging", async (req, res) => {
    try {
        console.log("Utlogging forespørsel mottatt");
        if (!req.isAuthenticated()) {
            console.log("Bruker ikke autentisert");
            return res.status(401).json({ error: "Ingen aktiv session" });
        }

        req.logout((err) => {
            if (err) {
                console.error("Feil ved utlogging:", err);
                return res.status(500).json({ error: "Feil ved utlogging" });
            }
            req.session.destroy((err) => {
                if (err) {
                    console.error("Feil ved sletting av session:", err);
                    return res.status(500).json({ error: "Feil ved sletting av session" });
                }
                res.clearCookie("connect.sid", { path: "/" });
                console.log("Utlogging vellykket");
                return res.status(200).json({ message: "Utlogging vellykket" });
            });
        });
    } catch (error) {
        console.error("Uventet feil:", error);
        res.status(500).json({ error: "Serverfeil" });
    }
});

//Sletting av bruker
app.post("/SletteBruker", [
    body('passord')
    .notEmpty().withMessage("Passord må fylles ut.")     //Validering av innlogging med express-validator https://express-validator.github.io/docs/
    .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.") 
], async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Ingen aktiv session" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { passord } = req.body;
        const bruker = req.user; 
        if (!passord) {
            return res.status(400).json({ error: "Passord må oppgis" });
        }
        const passordSjekk = await bcrypt.compare(passord, bruker.passord);
        if (!passordSjekk) {
            return res.status(401).json({ error: "Feil passord" });
        }
        if (!ObjectId.isValid(bruker._id)) {
            return res.status(400).json({ error: "Ugyldig bruker-ID" });
        }
        const objectId = new ObjectId(String(req.user._id));
        const slettetBruker = await db.collection("Brukere").deleteOne({ _id: objectId });
        if (slettetBruker.deletedCount === 0) {
            return res.status(500).json({ error: "Kunne ikke slette brukeren" });
        }
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: "Feil ved utlogging" });
            }
              req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ error: "Feil ved sletting av session" });
                }
                res.clearCookie("connect.sid", { path: "/" });
                return res.status(200).json({ message: "Bruker slettet og logget ut" });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Serverfeil", details: error.message });
    }
});

//Endring av brukerinfo







//Sjekk av session
app.get("/sjekk-session", (req, res) => {
    console.log("Sjekk session forespørsel mottatt");
    if (req.isAuthenticated()) {
        console.log("Bruker er autentisert:", req.user);
        return res.status(200).json({ bruker: req.user });
    } else {
        console.log("Ingen aktiv session");
        return res.status(401).json({ error: "Ingen aktiv session" });
    }
});


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

