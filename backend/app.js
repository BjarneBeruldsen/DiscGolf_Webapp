//Authors: Bjarne Beruldsen, Laurent Zogaj, Abdinasir Ali & Severin Waller Sørensen

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nocache = require('nocache');
const compression = require('compression');
const session = require('express-session');
const nodemailer = require('nodemailer');
const MongoStore = require('connect-mongo');
const { kobleTilDB, getDb } = require('./db');  
const PORT = process.env.PORT || 8000;
const path = require('path');
require('dotenv').config();
const passport = require('passport');
require('./ruter/brukerhandtering/passport')(passport);
const klubbRouter = require('./ruter/klubbhandtering'); 
const brukerRouter = require('./ruter/brukerhandtering/brukerhandtering'); 
const tilgangRouter = require('./ruter/brukerhandtering/tilgangskontroll');
const turneringRouter = require("./ruter/Turneringer");

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
app.use("/redigerBruker", nocache());

app.use(cors({
    origin: ["https://disk-applikasjon-39f504b7af19.herokuapp.com", "http://localhost:3000", "http://localhost:8000"], 
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
            "http://localhost:8000",
            "http://localhost:3000",
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
    store: MongoStore.create({           //https://github.com/jdesboeufs/connect-mongo?tab=readme-ov-file
      mongoUrl: process.env.MONGODB_URI, //URL til databasen 
      ttl: 5 * 24 * 60 * 60, //5 dager
      autoRemove: 'native', //Fjerner session automatisk
    }),                       
    cookie: {
        secure: process.env.NODE_ENV === 'production', //Må være true for at cookies skal fungere på nettsiden og false dersom siden skal funke lokalt, eller settes til production
        httpOnly: process.env.NODE_ENV === 'production', //Må være false når man tester lokalt og true ellers. Eller settes til production
        sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax", //Må være strict for at cookies skal fungere på nettsiden, sett den til "lax" for at siden skal funke lokalt
        maxAge: 1000 * 60 * 60 * 24 * 5,    //5 dager
    }
}));

//Initialisering av Passport.js
app.use(passport.initialize());
app.use(passport.session());

//Henter klubbhåndterings ruter
app.use(klubbRouter);

//Oppkobling mot databasen 
let db
kobleTilDB((err) => {
    if(!err) {
        db = getDb();

//Henter brukerhåndterings ruter
app.use(brukerRouter);

//Henter turneringshåndterings ruter
app.use(turneringRouter);

//Henter tilgangskontroll ruter
app.use('/api', tilgangRouter);

//Start av server
app.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});
    } else {
        console.error("Feil ved oppkobling til databasen", err);
    }
});

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
                    fornavn: bruker.fornavn,
                    etternavn: bruker.etternavn,
                    telefonnummer: bruker.telefonnummer,
                    bosted: bruker.bosted,
                    rolle: bruker.rolle,
                    poengkort: bruker.poengkort, 
                    invitasjoner: bruker.invitasjoner
                },
            });
        } catch (err) { //Logging
            return res.status(500).json({ error: "Feil ved henting av brukerdata" });
        }
    } //Logging
    return res.status(401).json({ error: "Ingen aktiv session" });
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

app.get('/byer', async (req, res) => {
    try {
      const db = getDb(); 
      if (!db) throw new Error('Database not connected');
      
      const byer = await db.collection('by').find().toArray(); 
      
      if (!byer || byer.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(byer);
      
    } catch (err) {
        console.error('Feil under databehandling:', err);
      
        res.status(500).json({
          error: 'Noe gikk galt'
        });
      }
      
  });
  
//Håndter alle andre ruter med React Router
app.get(/^(?!\/api).+/, (req, res) => { //Tilgangskontroll ruter funker ikke med wildcard
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});