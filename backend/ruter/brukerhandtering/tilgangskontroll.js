//Author: Severin Waller Sørensen
//Changed by: Laurent Zogaj

/* Denne filen definerer API-ruter for håndtering av brukere og tilgangskontroll.
 * Den inkluderer CRUD-operasjoner som oppdatering og sletting av brukere,
 * og sikrer at kun autentiserte brukere med riktige roller (f.eks. hoved-admin) kan utføre disse.
 */

const express = require('express');
const { ObjectId } = require('mongodb');
const { kobleTilDB, getDb } = require('../../db'); 
const { MongoClient } = require('mongodb');
const { beskyttetRute, sjekkBrukerAktiv, sjekkRolle } = require('./funksjoner');
const { leggTilSystemlogg } = require("../../models/Systemlogg");
const tilgangRouter = express.Router();


// Rute for å redigere brukerinformasjon
// sjekker at bruker er logget inn (beskyttetRute) og har riktig rolle (sjekkRolle, (i dette tilfellet hoved-admin))
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

        // Hent informasjon om brukeren som oppdateres
        const brukerSomOppdateres = await db.collection("Brukere").findOne({ _id: new ObjectId(brukerId) });
        
        if (!brukerSomOppdateres) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }

        const oppdateringer = req.body;
        const resultat = await db.collection("Brukere").updateOne(
            { _id: new ObjectId(brukerId) },
            { $set: oppdateringer }
        );

        if (resultat.matchedCount === 0) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }

        // Logg oppdateringen i systemloggen
        const endringer = Object.keys(oppdateringer).map(key => `${key}: '${oppdateringer[key]}'`).join(', ');
        await leggTilSystemlogg({
            tidspunkt: new Date(),
            bruker: req.user.brukernavn, // Brukernavn til admin som utførte oppdateringen
            handling: "Oppdaterte bruker",
            detaljer: `Admin '${req.user.brukernavn}' oppdaterte brukeren '${brukerSomOppdateres.brukernavn}' (ID: ${brukerId}). Endringer: ${endringer}`
        });

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

        // Hent informasjon om brukeren som skal slettes før sletting
        const brukerSomSkalSlettes = await db.collection("Brukere").findOne({ _id: new ObjectId(brukerId) });
        
        if (!brukerSomSkalSlettes) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }

        // Slett brukeren fra databasen
        const resultat = await db.collection("Brukere").deleteOne({ _id: new ObjectId(brukerId) });

        if (resultat.deletedCount === 0) {
            return res.status(404).json({ error: "Bruker ikke funnet" });
        }

        // Logg slettingen i systemloggen
        await leggTilSystemlogg({
            tidspunkt: new Date(),
            bruker: req.user.brukernavn, // Brukernavn til admin som utførte slettingen
            handling: "Slettet bruker",
            detaljer: `Admin '${req.user.brukernavn}' slettet brukeren '${brukerSomSkalSlettes.brukernavn}' (ID: ${brukerId})`
        });

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
        console.log("req.user:", req.user); 
        const bruker = await db.collection('Brukere').findOne({ _id: req.user._id });
        if (!bruker) {
            return res.status(404).json({ error: 'Bruker ikke funnet' });
        }
        res.status(200).json({
            rolle: bruker.rolle,
            hovedAdmin: bruker.hovedAdmin || false, 
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
        res.status(200).json(brukere); 
    } catch (err) {
        console.error("Feil ved henting av brukere:", err);
        res.status(500).json({ error: "Kunne ikke hente brukere" });
    }
});


// Rute for å hente spesifikk bruker basert på ID
tilgangRouter.get("/brukere/:id", (req, res) => {
    res.json({ message: `GET-forespørsel mottatt for bruker-ID: ${req.params.id}` });
});

//Rute for systeminnstillinger
tilgangRouter.get("/admin/systeminnstillinger", beskyttetRute, sjekkRolle(["hoved-admin"]), (req, res) => {
    res.json({ message: "Velkommen til systeminnstillinger!" });
});

// Rute for å teste tilgang til backend
// Ble brukt underveis i utviklingen for å sjekke at backend kommunsierte
tilgangRouter.get("/test", (req, res) => {
    res.json({ message: "Hei fra backend!" });
});

// eksporterer tilgangRouter slik at den kan brukes andre steder i applikasjonen
module.exports = tilgangRouter;