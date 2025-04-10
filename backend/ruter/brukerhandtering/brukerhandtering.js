//Author: Laurent Zogaj

const express = require('express');
const { ObjectId } = require('mongodb');
const { kobleTilDB, getDb } = require('../../db'); 
const { registreringValidering, innloggingValidering, redigeringValidering, sletteValidering, 
loggeInnStopp, registreringStopp, endringStopp } = require('./validering');
const { validationResult } = require('express-validator');
const bcrypt = require ('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { beskyttetRute, sjekkBrukerAktiv, sjekkRolle } = require('./funksjoner');
const brukerRouter = express.Router();

//Rute for registrering av bruker
brukerRouter.post("/Registrering", registreringValidering, registreringStopp, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        //Validering av input med express-validator hentet fra validering.js
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        //Sjekker om brukernavn eller e-post allerede finnes i databasen
        const {brukernavn, epost, passord, bekreftPassord} = req.body;
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
        console.log(`Bruker registrert: ${brukernavn}, e-post: ${epost}, rolle: ${nyBruker.rolle}`);
        res.status(201).json({ message: "Bruker registrert" });
    } catch (err) {
        console.log("Feil ved registrering:", err.message);
        res.status(500).json({ error: "Feil ved registrering" });
    }
});

//Rute for innlogging
brukerRouter.post("/Innlogging", innloggingValidering, loggeInnStopp, (req, res, next) => {
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
        //Logger inn bruker og lagrer session
        req.logIn(bruker, (err) => {
            if (err) {
                return next(err);
            }
            const { brukernavn, epost } = bruker;
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
                    //tidspunkt: Date.now()
                }
            });
        });
    })(req, res, next);
});

//Utlogging
brukerRouter.post("/Utlogging", beskyttetRute, sjekkBrukerAktiv, async (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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
            return res.status(401).json({ error: "Feil passord eller brukernavn" });
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
//Rute for å redigere brukerinformasjon og legge til mer info som fornavn, etternavn, telefonnummer og bosted
brukerRouter.patch("/RedigerBruker", beskyttetRute, sjekkBrukerAktiv, redigeringValidering, endringStopp, async (req, res) => {
    try {
        //Oppretter variabler/konstanter for redigering av bruker og objekt for å samle på endringer/oppdateringer
        const fjerning = {};
        const oppdatering = {};
        const { nyttBrukernavn, nyEpost, nyttPassord, passord, fornavn, etternavn, telefonnummer, bosted } = req.body;
        //Henter nåværende brukerdata
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
            return res.status(400).json({ error: error.array()[0].msg }); 
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
        //Under her oppdaterer vi ulike felt dersom bruker har lyst til å legge dem til. Sjekker også om verdiene er tomme eller ugyldige. Når det gjelder verdi 1 så har den egt ingen effekt da unset fjerner field uansett, ment mer som konvensjon.
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
        if (resultat.modifiedCount > 0 || fjerne.modifiedCount > 0) {
            if(fjerne.modifiedCount > 0) {
                console.log(`Fjernet unødvendige felt for bruker: ${bruker.brukernavn}, med epost: ${epost}`);
             }
                console.log(`Brukeroppdatering fullført for: ${brukernavn}, med epost: ${epost}`);
                    return res.status(200).json({ melding: "Brukerinformasjon oppdatert" });
            } else {
                return res.status(404).json({ error: "Brukeren ble ikke funnet" });
        }
    } catch (error) {
        console.error("Feil ved oppdatering av bruker:", error);
        return res.status(500).json({ error: "Noe gikk galt. Prøv igjen senere" });
    }
});
/*
//Hente brukerdata fra en spesifikk bruker, bruker sjekk-session istedenfor foreløpig da det funker bedre. 
brukerRouter.get("/bruker", beskyttetRute, sjekkBrukerAktiv, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({ error: 'Ingen database tilkobling' });
        const bruker = await db.collection('Brukere').findOne({ 
            _id: new ObjectId(String(req.user._id))
        });
        if (!bruker) {
            return res.status(404).json({ error: 'Bruker ikke funnet' });
        }
        res.status(200).json({
            fornavn: bruker.fornavn || "",
            etternavn: bruker.etternavn || "",
            telefonnummer: bruker.telefonnummer || "",
            bosted: bruker.bosted || "",
        });
    } catch (err) {
        console.error("Feil ved henting av brukerdata:", err);
        res.status(500).json({ error: "Kunne ikke hente brukerdata" });
    }
});
*/
//Rute for å hente alle brukere for søking etter brukere man kan komme i kontakt med
brukerRouter.get("/hentBrukere", beskyttetRute, sjekkBrukerAktiv, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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