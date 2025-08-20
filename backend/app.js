//Authors: Bjarne Beruldsen, Laurent Zogaj, Abdinasir Ali & Severin Waller Sørensen

/*
Dette er app.js filen som er hovedfilen for backend applikasjonen vår.
Her starter vi opp serveren og setter opp de ulike rutene som skal brukes i applikasjonen ved å hente dem fra de ulike filene i backend.
Vi setter opp blant annet express, express-session, cors og andre viktige middlewares for å få det hele til å fungere.
*/

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nocache = require('nocache');
const compression = require('compression');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const MongoStore = require('connect-mongo');
const { kobleTilDB, getDb } = require('./db');  
const PORT = process.env.PORT || 8000;
const path = require('path');
require('dotenv').config();
const passport = require('passport');
require('./ruter/brukerhandtering/passport')(passport);
const { klubbRouter, setSocketIO } = require('./ruter/klubbhandtering'); 
const brukerRouter = require('./ruter/brukerhandtering/brukerhandtering'); 
const tilgangRouter = require('./ruter/brukerhandtering/tilgangskontroll');
const turneringRouter = require("./ruter/Turneringer");
const systemloggRouter = require("./ruter/systemlogger");
const http = require('http');
const { Server } = require('socket.io');
const { sjekkBrukerAktiv, beskyttetRute } = require('./ruter/brukerhandtering/funksjoner');
// Swagger UI for API-dokumentasjon
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();
//Lese html skjema i req.body hvis nødvendig
app.use(express.urlencoded({ extended: true }));
//Skulle egentlig bli brukt til samtykke til cookies, den gjør at man får tilgang til eksisterende cookies via req.cookies + sjekke samtykke med connect.sid, men vi kan bare ha den her.
app.use(cookieParser());

//https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set("trust proxy", 1); //Heroku kjører proxy og må settes til trust for at ulike ting skal fungere ordentlig som express-rate-limit (IP) og session

app.disable('x-powered-by'); //Disabled for sikkerhet da man kan se hvilken teknologi som brukes 

//https://expressjs.com/en/advanced/best-practice-performance.html
//https://github.com/expressjs/compression#readme
//Brukes for gzip komprimering. Fant ut av dette med chrome dev tools og lighthouse, og det ble da anbefalt å bruke dette for å øke ytelsen
app.use(compression());

//NoCache Sikrer at nettleserer ikke lagrer cache for sensitive data/sider etter anbefalning av ZAP resultater.
//Bruker dette på "sårbare" ruter som kan inneholde sensitive data
//https://github.com/helmetjs/nocache
//https://ivanpiskunov.medium.com/a-little-bit-about-node-js-security-by-hands-17470dddf4d0 
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
app.use("/Innlogging", nocache());  
app.use("/Utlogging", nocache());   
app.use("/SletteBruker", nocache()); 
app.use("/Registrering", nocache());
app.use("/sjekk-session", nocache());
app.use("/redigerBruker", nocache());
app.use("/GlemtPassord", nocache());
app.use("/TilbakestillPassord", nocache());
app.use("/ValideringToken", nocache());

//Aller først hadde vi app use cors og kun det. Men etter lesing om sikkerhet fant vi ut at dette var en dårlig løsning, og at det var best å sette opp cors med spesifikke domener.
//https://auth0.com/blog/cors-tutorial-a-guide-to-cross-origin-resource-sharing/
app.use(cors({
    origin: [process.env.REACT_APP_API_BASE_URL, "http://localhost:3000", "http://localhost:8000"], 
    credentials: true,
}));

//Default Helmet konfigurasjon med litt konfigurasjoner for at bilder vi bruker skal lastes opp riktig og fremtidig ressurser https://helmetjs.github.io/ & https://github.com/helmetjs/helmet
//Helmet setter en del HTTP headers for å beskytte applikasjonen mot "populære" angrep som XSS, clickjacking og andre angrep. 
//Samtidig så man konfigurere den for å tillate ulike kilder som man kan se under her.
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
            process.env.REACT_APP_API_BASE_URL,
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

// Swagger/OpenAPI dokumentasjon
// Merk: Vi legger denne under /api slik at den ikke fanges av React-router wildcard lenger ned
try {
  const openapiSpec = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'openapi.json'), 'utf8')
  );
  // Løs opp CSP kun for Swagger UI slik at inline skript og styles fungerer
  app.use(
    '/api/docs',
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ["'self'"],
        },
      },
    })
  );
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.get('/api/openapi.json', (req, res) => res.json(openapiSpec));
} catch (e) {
  console.warn('Swagger/OpenAPI kunne ikke lastes:', e.message);
}

//Deployment under
//Legger serving fra statiske filer fra REACT applikasjonen
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve static files from the "filer" directory
app.use('/filer', express.static(path.join(__dirname, '../filer')));

//Konfigurasjon av session https://www.geeksforgeeks.org/how-to-handle-sessions-in-express/, https://expressjs.com/en/resources/middleware/session.html & https://www.passportjs.org/tutorials/password/session/
//De linkene over er brukt for å forstå oppsettet og hvordan man konfigurerer det  
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,                       //Lagrer session på hver request selv om ingen endringer er gjort
    saveUninitialized: false,            //Lagrer session selv uten ny data 
    proxy: process.env.NODE_ENV === 'production', //Må være true for at Heroku skal funke eller settes til production
    rolling: false,                      //Fornyer session ved hvert request, ikke vits forholder oss til maxAge
    store: MongoStore.create({           //https://github.com/jdesboeufs/connect-mongo?tab=readme-ov-file (Brukte denne docen for å forstå hvordan man setter opp session med mongo og hva som bør være med)
      mongoUrl: process.env.MONGODB_URI, //URI til databasen 
      ttl: 60 * 60 * 24, //1 dag
      autoRemove: 'native', //Fjerner session automatisk
    }),                       
    cookie: {
        secure: process.env.NODE_ENV === 'production', //Må være true for at cookies skal fungere på nettsiden og false dersom siden skal funke lokalt, eller settes til production
        httpOnly: process.env.NODE_ENV === 'production', //Må være false når man tester lokalt og true ellers. Eller settes til production
        sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax", //Må være strict for at cookies skal fungere på nettsiden, sett den til "lax" for at siden skal funke lokalt
        maxAge: 1000 * 60 * 60 * 24,    //1 dag
    }
}));

//Initialisering av Passport.js
app.use(passport.initialize());
app.use(passport.session());

//Henter klubbhåndterings ruter
app.use(klubbRouter);

// Opprett en HTTP-server for å bruke med socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", process.env.REACT_APP_API_BASE_URL], // Tillat frontend-URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Håndter socket.io-tilkoblinger
io.on('connection', (socket) => {
    console.log('En bruker koblet til:', socket.id);

    // Eksempel: Lytt til en melding fra klienten
    socket.on('chat melding', (data) => {
        console.log('Melding mottatt:', data);
        io.emit('chat melding', data); // Send meldingen til alle tilkoblede klienter
    });

    socket.on('disconnect', () => {
        console.log('En bruker koblet fra:', socket.id);
    });
});

// Send socket.io-instansen til klubbhandtering.js
setSocketIO(io);

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

//Henter systemlogg ruter
app.use('/api/systemlogg', systemloggRouter);

// Endre serverstart til å bruke HTTP-serveren
server.listen(PORT, () => {
    console.log(`Server kjører på port ${PORT}`);
});
    } else {
        console.error("Feil ved oppkobling til databasen", err);
    }
});

//Sjekk av session (en "auth-check" rute. Denne sjekker hver gang nettsiden blir åpnet av en besøker om bruker er logget inn eller ikke. Dersom logget inn returnerer den brukerdata som da kan bli hentet globalt på nettsiden av ulike rutere for innlogga brukere).
//Data vil ikke bli returnert med mindre man da er logget inn
app.get("/sjekk-session", async (req, res) => {
    //Sjekker om brukeren er logget inn
    if (req.isAuthenticated()) {
      //console.log("Cookie fra bruker:", req.cookies["connect.sid"]); 
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
                    invitasjoner: bruker.invitasjoner,
                    betalt : bruker.betalt,
                },
            });
        } catch (err) { //Logging
            return res.status(500).json({ error: "Feil ved henting av brukerdata" });
        }
    } //Logging
    return res.status(401).json({ error: "Ingen aktiv session" });
});

//Tilbakestille testdata fra klubb og reviews collection 
app.delete('/tommeTestdata', async (req, res) => {
  try {
      await db.collection('Klubb').deleteMany({});
      await db.collection('Reviews').deleteMany({});
      await db.collection('Turneringer').deleteMany({});
      res.status(200).json({ message: 'Testdata tømt' });
  } catch (error) {
      console.error("Feil ved tømming av testdata:", error);
      res.status(500).json({ error: 'Feil ved tømming av testdata' });
  }
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
    // Konfigurerer e-postinnstillinger for å sende en melding
    const mailOptions = {
      //forslag fra copilot, med mine tilpasninger
      from: process.env.EPOST_BRUKER, 
      to: process.env.EPOST_BRUKER, 
      subject: `Ny melding fra ${navn}`, 
      text: `Navn: ${navn}\nE-post: ${epost}\nMelding: ${melding}`,
    };
  // Sender e-posten ved hjelp av Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Feil ved sending av e-post:', error);
        res.status(500).json({ melding: 'Feil ved sending av e-post' });
      } else {
        console.log('E-post sendt:', info.response);
        //forslag av copilot, med mine tilpasninger
        res.status(200).json({ melding: 'E-post sendt vellykket' });
      }
    });
  });
// Rute for å hente alle byer fra databasen
app.get('/byer', async (req, res) => {
    try {
      const db = getDb(); 
      if (!db) throw new Error('Database not connected');
      // Henter alle dokumenter fra "by" samlingen i databasen
      const byer = await db.collection('by').find().toArray(); 
        // Sjekker om det finnes noen byer i databasen
      if (!byer || byer.length === 0) {
        //forslag fra copilot
        return res.status(200).json([]);
      }
      //forslag fra copilot  
      res.status(200).json(byer);
      
    } catch (err) {
       // Logger feilen til konsollen
        console.error('Feil under databehandling:', err);
      // Returnerer en feilmelding med statuskode 500
      //forslag fra copilot, med tilpasninger
        res.status(500).json({
          error: 'Noe gikk galt'
        });
      }
      
  });
    //Rute for å oppdatere brukerens betalingsstatus for dems medlemskap/abo
    app.post('/BetaleAbo', beskyttetRute, sjekkBrukerAktiv, async (req, res) => {
      try { 
          const db = getDb();
          if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
          const bruker  = req.user;
          //Setter betalt feltet til true i databasen
          const resultat = await db.collection("Brukere").updateOne(
            { _id: bruker._id },
            { $set: { betalt: true } }
          );//Sjekker om endringer ble gjort
          if (resultat.modifiedCount === 0) {
              return res.status(404).json({ error: "Ingen endringer gjort" });
          }
          res.status(200).json({ message: "Betaling registrert"});
      } catch (error) {
          console.error("Feil under betaling", error);
          res.status(500).json({ error: "Noe gikk galt" });
      }
    });
    //Rute for å avslutte abonnementet
    app.post('/AvslutteAbo', beskyttetRute, sjekkBrukerAktiv, async (req, res) => {
      try {
          const db = getDb();
          if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
          const bruker  = req.user;
          //Setter betalt feltet til false i databasen
         const resultat = await db.collection("Brukere").updateOne(
              { _id: bruker._id },
              { $set: { betalt: false } }
          );//Sjekker om endringer ble gjort
          if (resultat.modifiedCount === 0) {
              return res.status(404).json({ error: "Ingen endringer gjort" });
          }
          res.status(200).json({ message: "Abonnement avsluttet"});
      } catch (error) {
          console.error("Feil under avslutting av abonnement", error);
          res.status(500).json({ error: "Noe gikk galt" });
      }
    });

//Håndter alle andre ruter med React Router
app.get(/^(?!\/api).+/, (req, res) => { //Tilgangskontroll ruter funker ikke med wildcard. Dette er en workaround generert av copilot. Der man setter opp en regex som matcher alt som ikke starter med /api.
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});