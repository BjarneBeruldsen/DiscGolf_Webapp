const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require ('bcryptjs');
const { kobleTilDB, getDb } = require('./db'); 
const { ObjectId } = require('mongodb');    
const PORT = process.env.PORT || 8000;
const path = require('path');
require('dotenv').config();

const app = express();

app.disable('x-powered-by'); //Disabled for sikkerhet da man kan se hvilken teknologi som brukes 

app.use(cors({
    origin: ["https://disk-applikasjon-39f504b7af19.herokuapp.com", "http://localhost:3000"], 
    credentials: true,
}));

//Default Helmet konfigurasjon med litt konfigurasjoner for at bilder vi bruker skal lastes opp riktig og fremtidig ressurser https://helmetjs.github.io/ & https://github.com/helmetjs/helmet
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], //Tillater kun egne ressurser som standard
          imgSrc: ["'self'", "data:", "https://images.unsplash.com"], //Tillater lokale og Unsplash-bilder
        },
      },
    })
  );

  app.use(express.json());

//Deployment under
//Legger serving fra statiske filer fra REACT applikasjonen
app.use(express.static(path.join(__dirname, '../frontend/build')));


//Konfigurasjon av session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,              
    proxy: true,                          //Må være true for at Heroku skal funke
    cookie: {
        secure: true,                    //Må være true for at cookies skal fungere på nettsiden og false dersom siden skal funke lokalt
        httpOnly: true,                  //Må være false når man tester lokalt og true ellers
        sameSite: "strict",             //Må være strict for at cookies skal fungere på nettsiden, sett den til "lax" for at siden skal funke lokalt
        maxAge: 1000 * 60 * 60 * 24, //1 dag
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
            const funnetBruker = await db.collection("Brukere").findOne({ bruker: bruker.trim().toLowerCase() });
            if (!funnetBruker) {                                                                                                      
                return done(null, false, { message: "Bruker ikke funnet" });
            }
                                                                                            //https://www.passportjs.org/concepts/authentication/password/
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
    if (!ObjectId.isValid(id)) return done(new Error("Ugyldig ObjectId"));

    try {
        const bruker = await db.collection("Brukere").findOne({ _id: new ObjectId(id) });     //Står at den er deprecated, men fungerer og ingenting annet fungerer som alternativ
        if (!bruker) return done(new Error("Bruker ikke funnet"));
        done(null, bruker);
    } catch (err) {
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

//Ulike ruter 
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
        .isLength({ min: 3, max: 10 }).withMessage("Brukernavnet må være mellom 3 og 10 tegn.")
        .isAlphanumeric().withMessage("Brukernavnet kan bare inneholde bokstaver og tall."),
    body('passord')
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
        .matches(/[A-Z]/).withMessage("Passordet må inneholde minst én stor bokstav.")
        //.matches(/[0-9]/).withMessage("Passordet må inneholde minst ett tall.") //Ikke gyldig med passord for admin/test for prosjektet
        .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn."),
];

//Rute for registrering av bruker
app.post("/Registrering", registreringValidering, registreringStopp, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }

    const { bruker, passord } = req.body;

    try {
        const funnetBruker = await db.collection("Brukere").findOne({ bruker: bruker.trim().toLowerCase() });
        if (funnetBruker) {
            return res.status(400).json({ error: "Brukernavnet er allerede tatt" });
        }
        //Kryptering av passord
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passord, salt);

        //Lagrer bruker i databasen
        const nyBruker = { bruker: bruker.trim().toLowerCase(), passord: hashedPassword };
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

//Validering av innlogging med express-validator
const innloggingValidering = [
    body('bruker')
        .trim()
        .notEmpty().withMessage("Brukernavn må fylles ut.")
        .isAlphanumeric().withMessage("Brukernavnet kan bare inneholde bokstaver og tall."),
    body('passord')
        .notEmpty().withMessage("Passord må fylles ut.")
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
            
            //Fjerner passord før sending til frontend
            const brukerUtenPassord = { id: bruker._id, bruker: bruker.bruker };
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

