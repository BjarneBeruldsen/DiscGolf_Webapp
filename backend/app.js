//Authors: Bjarne Beruldsen, Laurent Zogaj, Abdinasir Ali & Severin Waller Sørensen

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nocache = require('nocache');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require ('bcryptjs');
const nodemailer = require('nodemailer');
const MongoStore = require('connect-mongo');
const { kobleTilDB, getDb } = require('./db'); 
const { ObjectId } = require('mongodb');    
const PORT = process.env.PORT || 8000;
const path = require('path');
require('dotenv').config();
const { beskyttetRute, sjekkBrukerAktiv } = require('./ruter/brukerhandtering/funksjoner');
const klubbRouter = require('./ruter/klubbhandtering'); 
const brukerRouter = require('./ruter/brukerhandtering/brukerhandtering.js'); 


const app = express();
app.use(express.urlencoded({ extended: true })); 


//https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set("trust proxy", 1); //Heroku kjører proxy og må settes til trust for at ulike ting skal fungere ordentlig som express-rate-limit (IP) og session

app.disable('x-powered-by'); //Disabled for sikkerhet da man kan se hvilken teknologi som brukes 

//https://expressjs.com/en/advanced/best-practice-performance.html
//https://github.com/expressjs/compression#readme
//Brukes for gzip komprimering. Fant ut av dette med chrome dev tools og lighthouse, og det ble da anbefalt å bruke dette for å øke ytelsen
app.use(compression());

//NoCache Sikrer at nettleserer ikke lagrer cache for sensitive data/sider etter anbefalning av ZAP
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
            "data:", 
            "https://images.unsplash.com", 
            "https://zewailcity.edu.eg",
            "https://zcadminpanel.zewailcity.edu.eg"
          ],
          frameSrc: ["'self'", "https://www.yr.no"],
          workerSrc: ["'self'", "blob:"],
          connectSrc: [
            "'self'",
            "https://api.mapbox.com",
            "https://events.mapbox.com",
            "https://*.tiles.mapbox.com",
            "https://*.mapbox.com",
            "https://api.mapbox.com/v4/",
            "https://api.mapbox.com/v4/mapbox.satellite/",
            "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com"],
          scriptSrc: ["'self'", "https://api.mapbox.com", "'unsafe-eval'"],
          upgradeInsecureRequests: [],
        },
      },
    })
);

app.use(express.json());

//Deployment under
//Legger serving fra statiske filer fra REACT applikasjonen
app.use(express.static(path.join(__dirname, '../frontend/build')));

//Konfigurasjon av session https://www.geeksforgeeks.org/how-to-handle-sessions-in-express/, https://expressjs.com/en/resources/middleware/session.html & https://www.passportjs.org/tutorials/password/session/ 
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

//Konfigurasjon av Passport.js https://www.passportjs.org/concepts/authentication/
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
            if (!funnetBruker) {
                return done(null, false, { message: "Brukernavn eller e-post ikke funnet" });
            }
            const passordSjekk = await bcrypt.compare(passord, funnetBruker.passord);
            if (!passordSjekk) {
                return done(null, false, { message: "Feil passord" });
            }
            else {
                //Hvis innloggingen er vellykket, returnerer vi brukeren
                return done(null, funnetBruker);
            }
        } catch (err) {
            //Returnerer en feil hvis noe går galt
            return done(err);
        }
    })
);
//Serialiserer brukeren ved å lagre brukerens ID i session
passport.serializeUser((bruker, done) => {
    try {
        done(null, bruker._id);
        console.log(`Bruker med ID ${bruker._id} logget inn (serialisering velykket)`);
    } catch (err) { 
        console.error("Feil under serialisering:", err);
        done(err);
    }
});
//Deserialiserer brukeren ved å hente brukerdata fra databasen basert på ID
passport.deserializeUser(async (id, done) => {
    try {
        //Sjekker om id er gyldig
        if (!ObjectId.isValid(id)) {
            return done(null, false, { message: "Ugyldig dokument-id" });
        }
        //Henter brukeren fra databasen
        const bruker = await db.collection("Brukere").findOne({ _id: new ObjectId(String(id)) });

        //(SKAL FJERNES I PRODUKSJON!!!!)--------------------
        // Logg brukerobjektet for å sjekke innholdet 
        console.log("Bruker hentet fra databasen:", bruker);
        //---------------------------------------------------

        //Hvis brukeren ikke finnes, returnerer vi en feilmelding
        if (!bruker) {
            return done(null, false, { message: "Bruker ikke funnet" });
        } else {
        //Hvis brukeren blir funnet returnerer vi den
            return done(null, bruker);
        }
    } catch (err) {
        //Returnerer en feil hvis noe går galt
        console.error("Feil under deserialisering:", err);
        return done(err);
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

app.use(klubbRouter);
app.use(brukerRouter);

//Rute for å redigere brukerinformasjon
app.patch("/api/brukere/:id", beskyttetRute, sjekkRolle(["hoved-admin"]), async (req, res) => {
    try {
        const brukerId = req.params.id;

        // Sjekk om ID-en er gyldig
        if (!ObjectId.isValid(brukerId)) {
            return res.status(400).json({ error: "Ugyldig bruker-ID" });
        }

        const oppdateringer = req.body;

        // Oppdater brukeren i databasen
        const resultat = await db.collection("Brukere").updateOne(
            { _id: new ObjectId(brukerId) },
            { $set: oppdateringer }
        );

        if (resultat.matchedCount === 0) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }

        res.status(200).json({ message: "Bruker oppdatert" });
    } catch (err) {
        console.error("Feil ved oppdatering av bruker:", err);
        res.status(500).json({ error: "Kunne ikke oppdatere bruker" });
    }
});

// Rute for å slette en bruker
app.delete("/api/brukere/:id", beskyttetRute, sjekkRolle(["hoved-admin"]), async (req, res) => {
    try {
        const brukerId = req.params.id;

        // Sjekk om ID-en er gyldig
        if (!ObjectId.isValid(brukerId)) {
            return res.status(400).json({ error: "Ugyldig bruker-ID" });
        }

        // Slett brukeren fra databasen
        const resultat = await db.collection("Brukere").deleteOne({ _id: new ObjectId(brukerId) });

        if (resultat.deletedCount === 0) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }

        res.status(200).json({ message: "Bruker slettet" });
    } catch (err) {
        console.error("Feil ved sletting av bruker:", err);
        res.status(500).json({ error: "Kunne ikke slette bruker" });
    }
});

//Andre ruter
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
                    rolle: bruker.rolle,
                    poengkort: bruker.poengkort //Legg til poengkort her
                },
            });
        } catch (err) { //Logging
            return res.status(500).json({ error: "Feil ved henting av brukerdata" });
        }
    } //Logging
    return res.status(401).json({ error: "Ingen aktiv session" });
});

// Rute for å hente brukerens rolle
app.get('/bruker/rolle', beskyttetRute, async (req, res) => {
    try {
        console.log("req.user:", req.user); // Legg til logging
        const bruker = await db.collection('Brukere').findOne({ _id: req.user._id });
        if (!bruker) {
            return res.status(404).json({ error: 'Bruker ikke funnet' });
        }
        res.status(200).json({
            rolle: bruker.rolle,
            superAdmin: bruker.superAdmin || false, // Returner superAdmin-status
        });
    } catch (err) {
        console.error('Feil ved henting av brukerens rolle:', err);
        res.status(500).json({ error: 'Feil ved henting av brukerens rolle' });
    }
});

app.get("/api/brukere", beskyttetRute, sjekkRolle(["hoved-admin"]), async (req, res) => {
    try {
        const brukere = await db.collection("Brukere").find({}).toArray();
        res.status(200).json(brukere); // Returnerer JSON
    } catch (err) {
        console.error("Feil ved henting av brukere:", err);
        res.status(500).json({ error: "Kunne ikke hente brukere" });
    }
});

//Tilbakestille testdata fra klubb collection 
app.delete('/tommeTestdata', (res) => {
    db.collection('Klubb').deleteMany({})
        .then(result => {
            res.status(200).json({ message: 'Testdata tømt' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Feil ved tømming av testdata' });
        });
});

//Kontaktskjema
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EPOST_BRUKER, 
      pass: process.env.EPOST_PASSORD, 
    },
  });
  
  // Behandle skjemainnsendinger
  app.post('/KontaktOss', (req, res) => {
    const { navn, epost, melding } = req.body;
  
    // Validering av input (enkel sjekk)
    if (!navn || !epost || !melding) {
      return res.status(400).json({ melding: 'Alle felt må fylles ut' });
    }
  
    const mailOptions = {
      from: process.env.EPOST_BRUKER, 
      to: process.env.EPOST_BRUKER, 
      subject: `Ny melding fra ${navn}`, 
      text: `Navn: ${navn}\nE-post: ${epost}\nMelding: ${melding}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Feil ved sending av e-post:', error);
        res.status(500).json({ melding: 'Feil ved sending av e-post' });
      } else {
        console.log('E-post sendt:', info.response);
        res.status(200).json({ melding: 'E-post sendt vellykket' });
      }
    });
  });

//Rute for systeminnstillinger
app.get("/admin/systeminnstillinger", beskyttetRute, sjekkRolle(["hoved-admin"]), (res) => {
    res.json({ message: "Velkommen til systeminnstillinger!" });
});

//Håndter alle andre ruter med React Router
app.get('*', (res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});