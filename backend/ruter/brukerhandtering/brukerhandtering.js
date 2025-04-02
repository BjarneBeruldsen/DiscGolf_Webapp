const express = require('express');
const { ObjectId } = require('mongodb');
const { kobleTilDB, getDb } = require('../../db'); 
const { registreringValidering, innloggingValidering, redigeringValidering, sletteValidering, 
loggeInnStopp, registreringStopp, endringStopp } = require('./validering');
const { validationResult } = require('express-validator');
const bcrypt = require ('bcryptjs');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { beskyttetRute, sjekkBrukerAktiv } = require('./funksjoner');

const brukerRouter = express.Router();

//Oppkobling mot databasen 
let db
kobleTilDB((err) => {
    if(!err) {
        db = getDb();
    } else {
        console.error("Feil ved oppkobling til databasen", err);
    }
});

//Rute for registrering av bruker
brukerRouter.post("/Registrering", registreringValidering, registreringStopp, async (req, res) => {
    try {
        //Validering av input med express-validator hentet fra validering.js
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        //Sjekker om brukernavn eller e-post allerede finnes i databasen
        const {brukernavn, epost, passord} = req.body;
        const funnetBruker = await db.collection("Brukere").findOne({
                $or: [
                    {brukernavn: brukernavn.trim().toLowerCase()},
                    {epost: epost.trim().toLowerCase()}
                ]
            });  
        //Returnerer feil hvis brukernavn eller e-post er i bruk
        if (funnetBruker) {
            console.log(`Registrering mislyktes: Brukernavn eller e-post (${brukernavn}, ${epost}) allerede i bruk.`);
            return res.status(400).json({ error: "Brukernavn eller e-post allerede registrert" });
        }
        //Kryptering av passord
        const salt = await bcrypt.genSalt(12);
        const hashetPassord = await bcrypt.hash(passord, salt);
        //Lagrer ny bruker i databasen
        const nyBruker = {
            brukernavn: brukernavn.trim().toLowerCase(),
            passord: hashetPassord,
            epost: epost.trim().toLowerCase(),
            rolle: "loggetInn",
            //tidspunkt: Date.now(),
        };
        await db.collection("Brukere").insertOne(nyBruker);
        //Logging
        console.log(`Bruker registrert: ${brukernavn}, e-post: ${epost}`);
        res.status(201).json({ message: "Bruker registrert" });
    } catch (err) {
        console.log("Feil ved registrering:", err.message);
        res.status(500).json({ error: "Feil ved registrering" });
    }
});
//Rute for innlogging
brukerRouter.post("/Innlogging", innloggingValidering, loggeInnStopp, (req, res, next) => {
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
            return res.status(400).json({ error: "Feil brukernavn eller passord" });
        }
        //Logger inn bruker og lagrer session
        req.logIn(bruker, (err) => {
            if (err) {
                return next(err);
            }
            const { brukernavn, epost } = bruker;
            console.log(`Bruker logget inn: ${brukernavn}, e-post: ${epost}`);
            console.log(`Session aktiv med ID: ${req.sessionID}`);
            //Returnerer brukerdata
            return res.status(200).json({
                message: "Innlogging vellykket", 
                bruker: {
                    id: bruker._id,
                    brukernavn: bruker.brukernavn,
                    epost: bruker.epost,
                    rolle: bruker.rolle,
                    //tidspunkt: Date.now()
                }
            });
        });
    })(req, res, next);
});
//Utlogging
brukerRouter.post("/Utlogging", beskyttetRute, sjekkBrukerAktiv, async (req, res) => {
    try {
        //Henter brukerdata for logging
        const { brukernavn, epost } = req.user;
        const bruker = { brukernavn, epost };
        //Utfører utlogging
        req.logout((err) => {
            if (err) {
                console.error("Feil ved utlogging:", err);
                return res.status(500).json({ error: "Feil ved utlogging" });
            }
            //Sletter brukerens session og cookie
            req.session.destroy((err) => {
                if (err) {
                    console.error("Feil ved sletting av session:", err);
                    return res.status(500).json({ error: "Feil ved sletting av session" });
                }
                res.clearCookie("connect.sid", { path: "/" });
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
brukerRouter.delete("/SletteBruker", beskyttetRute, sletteValidering, sjekkBrukerAktiv, async (req, res) => {
    try {
        //Validering av input med express-validator hentet fra validering.js
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        //Finner bruker enten via brukernavn eller e-post
        const { brukerInput, passord } = req.body;
        const bruker = await db.collection("Brukere").findOne({
            $or: [
                { brukernavn: brukerInput.trim().toLowerCase() },
                { epost: brukerInput.trim().toLowerCase() }
            ]
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
        const slettet = await db.collection("Brukere").deleteOne({ _id: bruker._id });
        console.log(`Bruker slettet, brukernavn: ${bruker.brukernavn}, e-post: ${bruker.epost}, ID: ${bruker._id}`); //tidspunkt: ${bruker.tidspunkt}
        if (slettet.deletedCount === 1) {
            //Logger ut og sletter session/cookie
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
//Rute for å redigere brukerinformasjon


//Rute for glemt passord


//Rute for å hente alle brukere for søking etter brukere man kan komme i kontakt med
brukerRouter.get("/hentBrukere", beskyttetRute, sjekkBrukerAktiv, async (res) => {
    try {
        const alleBrukere = [];
        //Henter alle brukere basert på gitte regler(projections)
        await db.collection("Brukere")
            .find({})
            .project({ brukernavn: 1, epost: 1, rolle: 1 })
            .forEach(bruker => {
                alleBrukere.push(bruker);
            });
        res.status(200).json(alleBrukere);
    } catch (err) {
        console.error("Feil ved henting av brukere:", err);
        res.status(500).json({ error: "Feil ved henting av brukerliste" });
    }
});


 
module.exports = brukerRouter;