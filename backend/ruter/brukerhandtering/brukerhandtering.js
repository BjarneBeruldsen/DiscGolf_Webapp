//Author: Laurent Zogaj

/* 
Denne filen definerer forskjellige API-ruter for håndtering av bruker.
Som registrering, innlogging, utlogging, sletting av bruker,
endring/legge/slette brukerinformasjon, tilbakestilling/glemt passord.
Dette ved hjelp av direkte CRUD-operasjoner mot MongoDB-databasen, ved hjelp av Node.js driveren for mongodb.
Passport blir brukt for autentisering.
Bruker validering med express-validator for å forhindre NoSQLi og XSS og rate-limiting for å forhindre brute-force angrep.
express.router for å lage ruter gjenbruke dem i app.js i backend.
*/

const express = require('express'); //Importerer express
const { getDb } = require('../../db'); //Kobler til databasen, henter fra db.js
const { registreringValidering, innloggingValidering, redigeringValidering, sletteValidering, 
loggeInnStopp, registreringStopp, endringStopp, 
nyttPassordStopp,
nyttPassordValidering,
sendingAvMailStopp} = require('./validering'); //Henter validering funskjoner fra validering.js
const { validationResult } = require('express-validator');
const bcrypt = require ('bcryptjs'); //Brukes til kryptering av passord og sammenligning av passord
const crypto = require('crypto'); //Brukes til generering av token for tilbakestilling av passord
const nodemailer = require('nodemailer'); //Brukes til sending av e-post
const passport = require('passport'); //Passport.js 
const { beskyttetRute, sjekkBrukerAktiv } = require('./funksjoner'); //Ulike funksjoner 
const { leggTilSystemlogg } = require("../../models/Systemlogg"); //Systemlogging for synlighet i medlemskap for admin
const brukerRouter = express.Router(); //Opprettelse av router for å så bruke rutene i app.js

//Rute for registrering av bruker
//Kort forklart:
//Legger til bruker i databasen ved å hente inputene fra frontend, deretter sjekke om det ikke er noen med samme brukernavn eller e-post.
//Deretter kryptere passordet og lagre det i databasen, altså hashingen.
brukerRouter.post("/bruker", registreringValidering, registreringStopp, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        //Validering av input med express-validator hentet fra validering.js
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });      
        }
        //Sjekker om brukernavn eller e-post allerede finnes i databasen
        const {brukernavn, epost, passord, bekreftPassord} = req.body; //Inputene fra frontend
        const funnetBruker = await db.collection("Brukere").findOne({
                $or: [
                    {brukernavn: brukernavn.trim().toLowerCase()},
                    {epost: epost.trim().toLowerCase()}
                ]
            });  
        //Returnerer feil hvis brukernavn eller e-post er i bruk
        if (funnetBruker) {
            console.log(`Registrering mislyktes: Brukernavn eller e-post (${brukernavn}, ${epost}) allerede i bruk.`);
            return res.status(400).json({ error: "Brukernavn eller e-post er allerede registrert" });
        }
        //Kryptering av passord med bcrypt
        const salt = await bcrypt.genSalt(12);
        const hashetPassord = await bcrypt.hash(passord, salt);
        //Lagrer ny bruker i databasen
        const nyBruker = {
            brukernavn: brukernavn.trim().toLowerCase(),
            passord: hashetPassord, //Kryptert passord blir lagret i databasen, det ekte passordet blir aldri synlig noen steder
            epost: epost.trim().toLowerCase(),
            rolle: "loggetInn",
        };
        await db.collection("Brukere").insertOne(nyBruker);
        //Logging
        console.log(`Bruker registrert: ${brukernavn}, e-post: ${epost}, rolle: ${nyBruker.rolle}`);
        res.status(201).json({ message: "Bruker registrert" });
    } catch (err) {
        console.log("Feil ved registrering:", err.message);
        res.status(500).json({ error: "Feil ved registrering" });
    }
});

//Rute for innlogging
//Kort forklart:
//Bruker passport sine funksjoner for innlogging og retunerer deretter brukerdata.
brukerRouter.post("/session", innloggingValidering, loggeInnStopp, async (req, res, next) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    //Validering av input med express-validator hentet fra validering.js
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    //Bruker passport for autentisering
    passport.authenticate("local", (err, bruker, info) => { 
        if (err) {
            console.error("Feil under autentisering:", err);  
            return next(err);
        }
        //Sjekker om bruker blir funnet
        if (!bruker) {
            return res.status(400).json({ error: info.message });
        }
        //Regenererer session for å hindre session fixation angrep (fant ut av dette etter pentesting og debugging, ikke at det var en feil men gjør innlogging mer sikker)
        req.session.regenerate((err) => {
            if (err) {
                console.error("Feil ved regenerering av session:", err);
                return res.status(500).json({ error: "Feil ved innlogging" });
            }
            //Logger inn bruker og lagrer session (req.login er en Passport-funksjon)
            req.logIn(bruker, (err) => {
                if (err) {
                    console.error("Feil ved innlogging:", err);
                    return res.status(500).json({ error: "Feil ved innlogging" });
                }
                const { brukernavn, epost } = bruker; //Henter logget inn bruker for logging
                console.log(`Bruker logget inn: ${brukernavn}, e-post: ${epost}, rolle: ${bruker.rolle}`);
                console.log(`Session aktiv med ID: ${req.sessionID}`);
                //Returnerer brukerdata
                return res.status(200).json({
                    message: "Innlogging vellykket", 
                    bruker: {
                        id: bruker._id,
                        brukernavn: bruker.brukernavn,
                        epost: bruker.epost,
                        rolle: bruker.rolle,
                    }
                });
            });
        });
    })(req, res, next);
});

//Utlogging
//Kort forklart:
//Bruker passport sin funksjon for utlogging og sletter session/cookie
brukerRouter.delete("/session", beskyttetRute, sjekkBrukerAktiv, async (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    try {
        //Henter brukerdata for logging
        const { brukernavn, epost } = req.user; //Innlogget bruker
        const bruker = { brukernavn, epost }; //Legger det inn i bruker
        //Utfører utlogging (req.logout er en Passport-funksjon)
        req.logout((err) => {
            if (err) {
                console.error("Feil ved utlogging:", err);
                return res.status(500).json({ error: "Feil ved utlogging" });
            }
            //Sletter brukerens session og cookie (funksjon fra express-session)
            req.session.destroy((err) => {  
                if (err) {
                    console.error("Feil ved sletting av session:", err);
                    return res.status(500).json({ error: "Feil ved sletting av session" });
                }
                res.clearCookie("connect.sid", { path: "/" });  //connect.sid er jo cookie navnet men her ble også path lagt til automatisk av copilot men etter litt søking på ulike forum så fant jeg ut express-session bruker det som default path for cookien.
                //Logging
                console.log(`Bruker logget ut: ${bruker.brukernavn}, ${bruker.epost}`);
                console.log(`Session med ID: ${req.sessionID} er slettet`);
                return res.status(200).json({ message: "Utlogging vellykket" });
            });
        });
    } catch (error) {
        console.error("Uventet feil ved utlogging:", error);
        return res.status(500).json({ error: "Noe gikk galt. Prøv igjen senere" });
    }
});

//Sletting av bruker
//Kort forklart:
//Finner brukeren via frontend inputs. Sjekker passordet og sletter brukeren, og deretter logger ut/sletter session for å fjerne alt av "rusk" som kan være igjen.
brukerRouter.delete("/bruker", beskyttetRute, sletteValidering, sjekkBrukerAktiv, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        //Validering av input med express-validator hentet fra validering.js
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        //Finner bruker enten via brukernavn eller e-post
        const { brukerInput, passord } = req.body; //Fra frontend
        const bruker = await db.collection("Brukere").findOne({
            $or: [
                { brukernavn: brukerInput.trim().toLowerCase() }, 
                { epost: brukerInput.trim().toLowerCase() }
            ]
        });
        if (!bruker) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }
        //Sjekker passord med bcrypt
        const passordSjekk = await bcrypt.compare(passord, bruker.passord);
        if (!passordSjekk) {
            return res.status(401).json({ error: "Feil passord eller brukernavn" });
        }
        //Sletter bruker
        const slettet = await db.collection("Brukere").deleteOne({ _id: bruker._id });
        console.log(`Bruker slettet, brukernavn: ${bruker.brukernavn}, e-post: ${bruker.epost}, ID: ${bruker._id}`); 
        if (slettet.deletedCount === 1) {           //Fant ut av dette med deletedcount via documentasjonen til mongodb. 
            //Logger ut og sletter session/cookie (bruker funksjoner som medfølger fra express-session)
            req.session.destroy((err) => {
                if (err) {
                    console.error("Feil ved sletting av session:", err);
                    return res.status(500).json({ error: "Feil ved sletting av session" });
                }
                res.clearCookie("connect.sid", { path: "/" });
                return res.status(200).json({ message: "Brukeren er nå slettet" });
            });
        } else {
            return res.status(500).json({ error: "Kunne ikke slette bruker" });
        }
    } catch (err) {
        console.error("Feil ved sletting av bruker:", err);
        return res.status(500).json({ error: "Noe gikk galt. Prøv igjen senere" });
    }
});
//Rute for å redigere brukerinformasjon og legge til mer info som fornavn, etternavn, telefonnummer og bosted
//Forklaringer under
brukerRouter.patch("/bruker", beskyttetRute, sjekkBrukerAktiv, redigeringValidering, endringStopp, async (req, res) => {
    try {
        //Oppretter variabler/konstanter for redigering av bruker og objekt for å samle på endringer/oppdateringer og eventuelle fjerning av felt
        const fjerning = {};
        const oppdatering = {};
        const { nyttBrukernavn, nyEpost, nyttPassord, passord, fornavn, etternavn, telefonnummer, bosted } = req.body; //req.body er dataene som kommer fra frontend altså det bruker skriver inn i input feltene og blir sendt til backend for videre behandling.
        //Henter nåværende brukerdata. req.user er en funksjon fra passport som da gir oss tilgang til å hente ut brukerdata fra den innloggede brukeren
        const bruker = req.user;
        const brukernavn = bruker.brukernavn; 
        const epost = bruker.epost;
        const brukerId = bruker._id; 
        //Sjekker db kobling 
        const db = getDb(); 
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        //Validering av input med express-validator hentet fra validering.js
        const error = validationResult(req);    
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array()[0].msg }); //Henter .msg (feilmeldingen) fra første valideringsfeil i arrayet. Dette var en anbefalning fra copilot samt at jeg fant ut av det via dokumentasjonen til express-validator. Jeg fikk error som typeError i konsollet og det var fordi jeg prøvde å hente ut hele arrayet og ikke bare første elementet. Da anbefalte copilot dette og det funket.
        }
        //Boolean for å sjekke om noe er endret
        let sjekkeEndringer = false;
        //Sjekker om nytt brukernavn allerede finnes hvis bruker vil endre det 
        if (nyttBrukernavn && nyttBrukernavn !== brukernavn) {
            const funnetBruker = await db.collection("Brukere").findOne({
                brukernavn: nyttBrukernavn.trim().toLowerCase()
            });
            if (funnetBruker) {
                return res.status(400).json({ error: "Brukernavn er allerede tatt" });
            } else {
                console.log(`Nytt brukernavn registrert for bruker: ${bruker.brukernavn}, nytt brukernavn: ${nyttBrukernavn}, med epost: ${epost}`);
                oppdatering.brukernavn = nyttBrukernavn.trim().toLowerCase();
                sjekkeEndringer = true;
            }
        }
        //Sjekker om ny epost allerede finnes hvis bruker vil endre det
        if (nyEpost && nyEpost !== epost) {
            const funnetBruker = await db.collection("Brukere").findOne({
                epost: nyEpost.trim().toLowerCase()
            });
            if (funnetBruker) {
                return res.status(400).json({ error: "E-post er allerede tatt" });
            } else {
                console.log(`Ny epost registrert for bruker: ${bruker.brukernavn}, gammel epost: ${epost}, ny epost: ${nyEpost}`);
                oppdatering.epost = nyEpost.trim().toLowerCase();
                sjekkeEndringer = true;
            }
        }
        //Sjekker om bruker har oppgitt nytt passord med validering
        if (nyttPassord) {
            if (!passord) {
                return res.status(400).json({ error: "Nåværende passord må oppgis" });
            }
            //Sjekk om brukerens gamle passord stemmer
            const passordSjekk = await bcrypt.compare(passord, bruker.passord);
            if (!passordSjekk) {
                return res.status(401).json({ error: "Feil passord eller brukernavn" });
            } else {
            //Krypterer nytt passord
            const salt = await bcrypt.genSalt(12);
            const hashetPassord = await bcrypt.hash(nyttPassord, salt);
            //Legger til nytt passord 
            oppdatering.passord = hashetPassord;
            sjekkeEndringer = true;
            console.log(`Passord endret for bruker: ${bruker.brukernavn}, med epost: ${epost}`);
            }
        }
        if (!nyttBrukernavn && !nyEpost ) {
            return res.status(400).json({ error: "Brukernavn og Epost kan ikke være tomt" });
        }
        //Under her oppdaterer vi ulike felt dersom bruker har lyst til å legge dem til. Sjekker også om verdiene er tomme eller ugyldige. Når det gjelder verdi 1 så har den egt ingen effekt da 'unset' fjerner field uansett, ment mer som konvensjon.
        //Aller først så hadde jeg kun if med undefined og kun det, og da ente det opp med at fields i databasen ble "" der brukeren ikke valgte å legge til noe.
        //Så etter en samtale med copilot så anbefalte den å legge til null og "" i if setningene også.
        //Men fieldsene var fortsatt til stede. Så da la jeg til else if og implementerte en fjerning av "ubrukelige" fields.
        if (fornavn !== undefined && fornavn !== null && fornavn !== "") {
            oppdatering.fornavn = fornavn.trim();
            sjekkeEndringer = true;
        } else if (fornavn !== undefined) {
            fjerning.fornavn = 1;
            sjekkeEndringer = true;
        }
        if (etternavn !== undefined && etternavn !== null && etternavn !== "") {
            oppdatering.etternavn = etternavn.trim();
            sjekkeEndringer = true;
        } else if (etternavn !== undefined) {
            fjerning.etternavn = 1;
            sjekkeEndringer = true;
        }
        if (telefonnummer !== undefined && telefonnummer !== null && telefonnummer !== "") {
            oppdatering.telefonnummer = telefonnummer.trim();
            sjekkeEndringer = true;
        } else if (telefonnummer !== undefined) {
            fjerning.telefonnummer = 1;
            sjekkeEndringer = true;
        }
        if (bosted !== undefined && bosted !== null && bosted !== "") {
            oppdatering.bosted = bosted.trim();
            sjekkeEndringer = true;
        } else if (bosted !== undefined) {
            fjerning.bosted = 1;
            sjekkeEndringer = true;
        }
        //Returner feilmelding hvis ingen endringer er gjort
        if (!sjekkeEndringer) {
            return res.status(400).json({ error: "Ingen endringer gjort" });
        }

        //Utfører oppdatering til databasen av brukeren med autentisert bruker-ID
        const resultat = await db.collection("Brukere").updateOne(
            { _id: brukerId }, 
            { $set: oppdatering }
        );

        //Fjerner unødvendig fields hvis tomme
        const fjerne = await db.collection("Brukere").updateOne(
            { _id: brukerId },
            { $unset:  fjerning  }
        );
        //Sjekking og logging
        if (resultat.modifiedCount > 0 || fjerne.modifiedCount > 0) {  //Hvis det er endringer i databasen 
            if(fjerne.modifiedCount > 0) { // Hvis det er endringer i fjerning
                console.log(`Fjernet unødvendige felt for bruker: ${bruker.brukernavn}, med epost: ${epost}`);
             }
                console.log(`Brukeroppdatering fullført for: ${brukernavn}, med epost: ${epost}`);

                //Lagrer endringen i systemlogg 
                await leggTilSystemlogg({
                    tidspunkt: new Date(),
                    bruker: req.user.brukernavn, //Brukernavn til den som utførte handlingen
                    handling: "Oppdaterte brukerinformasjon",
                    detaljer: `Endret informasjon for bruker '${brukernavn}' med e-post '${epost}'`
                });
                    return res.status(200).json({ melding: "Brukerinformasjon oppdatert" });
            } else {
                return res.status(404).json({ error: "Brukeren ble ikke funnet" });
        }
    } catch (error) {
        console.error("Feil ved oppdatering av bruker:", error);
        return res.status(500).json({ error: "Noe gikk galt. Prøv igjen senere" });
    }
});

//Noe gjenbruk av samme logikken som vi har brukt i de andre rutene
//Nedenfor her
//Rute for glemt passord
brukerRouter.post("/passord/glemt", sendingAvMailStopp, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        const { brukerInput } = req.body; //Input fra frontend
        //Finner brukeren i databasen via brukernavn eller epost
        const bruker = await db.collection("Brukere").findOne({
            $or: [
                { brukernavn: brukerInput.trim().toLowerCase() },
                { epost: brukerInput.trim().toLowerCase() }
            ]
        });
        if (!bruker) {
            console.log("Bruker ikke funnet:", brukerInput);
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }
        //Token var ikke noe jeg tenkte på først men etter flere feil og masse debugging så spurte jeg copilot om hjelp.
        //På starten var dette veldig basic der jeg ikke hadde token med i det hele tatt, og uten tokenet kunne hvem som helst tilbakestille passordet til en annen bruker.
        //Og lenken var aktiv hele tiden naturligvis da den ikke hadde token.
        //Generer token og utløpsdato/tid
        const token = crypto.randomBytes(20).toString("hex"); //Bruker crypto pakken for generering av token
        const tokenDato = new Date(Date.now() + 3600000); //1 time + dato. Dvs at tokenet er gyldig i 1 time(lenken)
        //const tokenDato = new Date(Date.now() + 180000); //3 minutter for testing + dato
        //Lagrer token og utløpsdatoen i databasen
        await db.collection("Brukere").updateOne(
            { _id: bruker._id },
            { $set: { resetToken: token, resetTokenDato: tokenDato } }
        );
        //URL for tilbakestilling av passord
        const URL = "https://disk-applikasjon-39f504b7af19.herokuapp.com";
        const resetUrl = `${URL}/TilbakestillPassord/${token}?email=${encodeURIComponent(bruker.epost)}`; //Setter en custom url med litt ulike parametre, slik at det kan valideres
        //const URL = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
        //const resetUrl = `${URL}/TilbakestillPassord/${token}?email=${encodeURIComponent(bruker.epost)}`; //Setter en custom url med litt ulike parametre, slik at det kan valideres
        
        //Setter opp sending av e-post med nodemailer
        //Henter epost og passordet til gmail kontoen vår fra .env i bakcend
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EPOST_BRUKER,
                pass: process.env.EPOST_PASSORD,
            },
        });
        //Sender eposten med tilbakestillingslenke
        const mailOptions = {
            from: process.env.EPOST_BRUKER,
            to: bruker.epost,
            subject: "Tilbakestilling av passord",
            text: `Hei,\n\nKlikk på følgende lenke for å tilbakestille passordet ditt:\n\n${resetUrl}\n\nLenken er gyldig i 1 time.`,
            html: `<p>Hei,</p>
                    <p>Klikk på følgende lenke for å tilbakestille passordet ditt:</p>
                    <a href="${resetUrl}">${resetUrl}</a>
                    <p>Lenken er gyldig i 1 time.</p>`
        };
        //Sender eposten
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Feil ved sending av e-post:", error);
              res.status(500).json({ melding: "Feil ved sending av e-post" });
            } else {
              console.log("E-post for tilbakestilling av passord sendt:", info.response);
              res.status(200).json({ melding: "E-post sending vellykket" });
            }
        });
    } catch (error) {
        console.error("Feil ved sending av epost", error);
        res.status(500).json({ error: "Noe gikk galt. Prøv igjen senere" });
    }
});
//Jeg prøvde først å holde meg til to ruter men fant ut det ble rotete og vanskelig
//Rute for validering av token 
brukerRouter.post("/passord/valider", async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        //Henter token og e-post fra frontend
        const { token, epost } = req.body;
        //Finner brukeren med det tokenet og eposten
        const bruker = await db.collection("Brukere").findOne({
            resetToken: token,
            epost: epost.trim().toLowerCase()
        });
        //Sjekk hvis ingen bruker blir funnet
        if (!bruker) {
            return res.status(200).json({ 
                gyldig: false, 
                grunn: 'Ingen bruker funnet med dette token og e-post'
            });
        }
        //Copilot bidro her
        //Sjekk om token er utløpt
        const tokenUtløpt = new Date(bruker.resetTokenDato).getTime();
        const tokenNå = Date.now();
        const tokenGyldig = tokenUtløpt > tokenNå; 
        //Sletter tokenet hvis det er utløpt for å unngå unnødvendige fields
        if (!tokenGyldig) {
            await db.collection("Brukere").updateOne(
                { _id: bruker._id },
                { $unset: { resetToken: 1, resetTokenDato: 1 } }
            );
        }//Returnerer gyldig status og tid til utløp
        //Copilot bidro her
        return res.status(200).json({
            gyldig: tokenGyldig,
            tidDiff: Math.floor((tokenUtløpt - tokenNå) / 1000)
        });
    } catch (error) {//Logging
        console.error("Feil ved validering av token:", error);
        return res.status(500).json({ error: "Noe gikk galt. Prøv igjen senere" });
    }
});
//Dette er da ruten som tilbakestiller passordet
//Rute for tilbakestilling av passord
brukerRouter.post("/passord/tilbakestill", nyttPassordStopp, nyttPassordValidering, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        //Henter token, e-post og nytt passord fra frontend
        const { token, epost, nyttPassord } = req.body;
        //Finner brukeren med token og eposten
        const bruker = await db.collection("Brukere").findOne({
            resetToken: token,
            epost: epost.trim().toLowerCase()
        });
        //Hvis ingen bruker blir funnet
        if (!bruker) {
            return res.status(400).json({ error: "Ugyldig token eller e-post" });
        }
        //Sjekker om token er utløpt
        //Copilot bidro her
        const tokenUtløpt = new Date(bruker.resetTokenDato).getTime();
        const tokenNå = Date.now();
        //Copilot bidro her
        //Hvis den har det fjerner vi den fra databasen
        if (tokenUtløpt <= tokenNå) {
            await db.collection('Brukere').updateOne(
                { _id: bruker._id },
                { $unset: { resetToken: 1, resetTokenDato: 1 } }
            );
            return res.status(400).json({ error: "Token er utløpt. Vennligst be om en ny tilbakestillingslenke." });
        }
        //Sjekker passordet om det er det samme
        const passordSjekk = await bcrypt.compare(nyttPassord, bruker.passord);
        if (passordSjekk) {
            return res.status(400).json({ error: "Nytt passord kan ikke være det samme som det gamle passordet" });
        }
        //Krypterer det nye passordet
        const salt = await bcrypt.genSalt(12);
        const hashetPassord = await bcrypt.hash(nyttPassord, salt);
        //Oppdaterer passordet i databasen og fjernet token og dato
        const oppdatering = await db.collection("Brukere").updateOne(
            { _id: bruker._id },
            {
                $set: { passord: hashetPassord },
                $unset: { resetToken: 1, resetTokenDato: 1 }
            }
        );
        if (oppdatering.modifiedCount === 0) { //Ingen oppdatering
            return res.status(500).json({ error: "Kunne ikke oppdatere passord, ingen endring" });
        }
        return res.status(200).json({ melding: "Passordet er oppdatert" });
    } catch (error) { 
        console.error("Feil ved tilbakestilling av passord:", error);
        return res.status(500).json({ error: "Noe gikk galt. Prøv igjen senere" });
    }
});

//Eksporterer routeren slik at den kan brukes i app.js
module.exports = brukerRouter;