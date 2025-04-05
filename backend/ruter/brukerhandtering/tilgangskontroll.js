//Author: Severin Waller Sørensen

const express = require('express');
const { ObjectId } = require('mongodb');
const { kobleTilDB, getDb } = require('../../db'); 
const { MongoClient } = require('mongodb');
const { beskyttetRute, sjekkBrukerAktiv, sjekkRolle } = require('./funksjoner');
const tilgangRouter = express.Router();






// Rute for å redigere brukerinformasjon
tilgangRouter.patch("/brukere/:id", beskyttetRute, sjekkRolle(["hoved-admin"]), async (req, res) => {
    try {
        console.log("Mottatt data for oppdatering:", req.body); // Logg dataene fra frontend
        console.log("Bruker-ID:", req.params.id);

        const db = getDb();
        if (!db) return res.status(500).json({ error: "Ingen database tilkobling" });

        const brukerId = req.params.id;
        if (!ObjectId.isValid(brukerId)) {
            return res.status(400).json({ error: "Ugyldig bruker-ID" });
        }

        const oppdateringer = req.body;
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
tilgangRouter.delete("/brukere/:id", beskyttetRute, sjekkRolle(["hoved-admin"]), async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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
// Rute for å hente brukerens rolle
tilgangRouter.get('/bruker/rolle', beskyttetRute, async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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

// Rute for å hente alle brukere
tilgangRouter.get("/brukere", beskyttetRute, sjekkRolle(["hoved-admin"]), async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        const brukere = await db.collection("Brukere").find({}).toArray();
        res.status(200).json(brukere); // Returnerer JSON
    } catch (err) {
        console.error("Feil ved henting av brukere:", err);
        res.status(500).json({ error: "Kunne ikke hente brukere" });
    }
});

/* Skaper konflikt foreløpig
tilgangRouter.get("/brukere", async (req, res) => {
    try {
        const db = getDb();
        const brukere = await db.collection("Brukere").find({}).toArray(); // Henter alle brukere
        res.status(200).json(brukere); // Returnerer brukerne som JSON
    } catch (err) {
        console.error("Feil ved henting av brukere:", err);
        res.status(500).json({ error: "Kunne ikke hente brukere" });
    }
});
*/
tilgangRouter.get("/brukere/:id", (req, res) => {
    res.json({ message: `GET-forespørsel mottatt for bruker-ID: ${req.params.id}` });
});

//Rute for systeminnstillinger
tilgangRouter.get("/admin/systeminnstillinger", beskyttetRute, sjekkRolle(["hoved-admin"]), (req, res) => {
    res.json({ message: "Velkommen til systeminnstillinger!" });
});


tilgangRouter.get("/test", (req, res) => {
    res.json({ message: "Hei fra backend!" });
});

module.exports = tilgangRouter;