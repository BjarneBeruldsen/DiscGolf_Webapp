//Author: Severin Waller Sørensen

/* Denne filen definerer API-ruter for å håndtere turneringer.
 * Filen håndterer CRUD-operasjoner for turneringer, og sjekker at kun
 * autoreserte brukere kan opprette turneringer.
 * Validering er også inkludert for å sikre data.
 */

const express = require("express");
const { getDb } = require("../db");
const { ObjectId } = require("mongodb");
const { beskyttetRute, sjekkRolle } = require("./brukerhandtering/funksjoner");
const { 
    turneringValidering, 
    mobileTurneringValidering,           
    webTurneringOpprettelseStopp,        
    mobilTurneringOpprettelseStopp       
} = require("./brukerhandtering/validering");
const { validationResult } = require("express-validator");

const turneringRouter = express.Router();

// Opprett ny turnering.
// sjekker at kun brukere med rolle som klubbleder (eller høyere) kan opprette turneringer
turneringRouter.post("/api/turneringer", beskyttetRute, sjekkRolle (["klubbleder", "admin", "hoved-admin"]), turneringValidering, async (req, res) => {
    const db = getDb();
    const { navn, dato, bane, beskrivelse } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) { //Henter feil fra validering 
      return res.status(400).json({ error: error.array()[0].msg });
    }
    // Sjekker at alle påkrevde felt er fylt ut
    if (!navn || !dato || !bane ) {
      return res.status(400).json({ error: "Mangler påkrevde felt" });
    }

    try {
      const nyTurnering = { // opprette nytt objekt med data fra req.body
        navn,
        dato,
        bane,
        beskrivelse,
        opprettetAv: req.user._id, // Hvem som laget turneringen
      };
      const resultat = await db.collection("Turneringer").insertOne(nyTurnering);
      res.status(201).json({ _id: resultat.insertedId, ...nyTurnering });
                          // copilot foreslo ...(spreadSyntax) for å inkludere alle feltene i nyTurnering
                          // slik at de ikke måtte skrives ut en og en nyTurnering.navn, nyTurnering.dato osv.

    } catch (error) {
      console.error("Feil:", error.message);
      res.status(500).json({ error: "Kunne ikke opprette turnering" });
    }
  }
);

// Funksjon som henter alle turneringene
turneringRouter.get("/api/turneringer", async (req, res) => {
  try {
    const db = getDb();
    const turneringer = await db.collection("Turneringer").find().toArray();
    res.status(200).json(turneringer);
  } catch (err) {
    console.error("Feil ved henting av turneringer:", err);
    res.status(500).json({ error: "Kunne ikke hente turneringer" });
  }
});

module.exports = turneringRouter;



// ===== MOBILE APP TURNERINGER   =====

// Opprett ny turnering (MOBILE - ALLE KAN LAGE)
// Opprett ny turnering (MOBILE - ALLE KAN LAGE)
// Fjernet 'beskyttetRute', sjekker userId manuelt
turneringRouter.post("/api/mobile/turneringer", mobilTurneringOpprettelseStopp, mobileTurneringValidering, async (req, res) => {
    const db = getDb();
    const { navn, dato, beskrivelse, sted, adresse, deltakere, premiepott, kontakt, userId } = req.body;
    
    // Fallback: Bruker session hvis tilgjengelig, ellers userId fra appen
    let oppretterId = (req.user && req.user._id) ? req.user._id : userId;

    if (!oppretterId) {
        return res.status(401).json({ error: "Mangler bruker-ID. Du må være logget inn." });
    }

    // Konverter string-ID til ObjectId hvis den kommer fra appen
    try {
        if (typeof oppretterId === 'string') oppretterId = new ObjectId(oppretterId);
    } catch (e) {
        return res.status(400).json({ error: "Ugyldig bruker-ID format" });
    }

    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ error: error.array()[0].msg });

    if (!navn || !dato || !sted || !adresse || !deltakere || !premiepott || !kontakt) {
        return res.status(400).json({ error: "Mangler påkrevde felt" });
    }

    try {
        const nyTurnering = {
            navn,
            dato,
            beskrivelse,
            sted,
            adresse,
            deltakere: parseInt(deltakere),
            premiepott,
            kontakt,
            opprettetAv: oppretterId, // Bruker ID-en vi fant over
            opprettetDato: new Date(),
            status: "Oppkommende",
            registreringer: [],
            source: "mobile"
        };

        const resultat = await db.collection("Turneringer").insertOne(nyTurnering);
        
        res.status(201).json({
            success: true,
            message: "Turnering opprettet",
            turneringId: resultat.insertedId.toString(),
            turnering: { _id: resultat.insertedId, ...nyTurnering }
        });
    } catch (error) {
        console.error("Feil ved opprettelse av turnering (mobil):", error.message);
        res.status(500).json({ error: "Kunne ikke opprette turnering" });
    }
});

// Hent alle mobil turneringer
turneringRouter.get("/api/mobile/turneringer", async (req, res) => {
    try {
        const db = getDb();
        const turneringer = await db.collection("Turneringer").find({ source: "mobile" }).toArray();
        res.status(200).json(turneringer);
    } catch (err) {
        console.error("Feil ved henting av turneringer (mobil):", err);
        res.status(500).json({ error: "Kunne ikke hente turneringer" });
    }
});

// Hent en spesifikk mobil turnering
turneringRouter.get("/api/mobile/turneringer/:id", async (req, res) => {
    try {
        const db = getDb();
        const turnering = await db.collection("Turneringer").findOne({ 
            _id: new ObjectId(req.params.id),
            source: "mobile"
        });
        
        if (!turnering) {
            return res.status(404).json({ error: "Turnering ikke funnet" });
        }
        
        res.status(200).json(turnering);
    } catch (err) {
        console.error("Feil ved henting av turnering (mobil):", err);
        res.status(500).json({ error: "Kunne ikke hente turnering" });
    }
});
// Oppdater mobil turnering (kun oppretteren)
// Fjernet 'beskyttetRute', sjekker userId manuelt
turneringRouter.patch("/api/mobile/turneringer/:id", async (req, res) => {
    try {
        const db = getDb();
        const turneringId = req.params.id;
        const { userId } = req.body; // Appen må sende userId her også

        // Sjekk hvem som spør
        const requestUserId = (req.user && req.user._id) ? req.user._id.toString() : userId;

        if (!requestUserId) {
            return res.status(401).json({ error: "Mangler bruker-ID." });
        }
        
        const turnering = await db.collection("Turneringer").findOne({ _id: new ObjectId(turneringId) });
        
        if (!turnering) return res.status(404).json({ error: "Turnering ikke funnet" });

        // Sjekk at ID matcher eieren av turneringen
        if (turnering.opprettetAv.toString() !== requestUserId) {
            return res.status(403).json({ error: "Du har ikke tilgang til å oppdatere denne turneringen" });
        }

        const resultat = await db.collection("Turneringer").updateOne(
            { _id: new ObjectId(turneringId) },
            { $set: req.body }
        );

        res.status(200).json({ message: "Turnering oppdatert" });
    } catch (err) {
        console.error("Feil ved oppdatering av turnering (mobil):", err);
        res.status(500).json({ error: "Kunne ikke oppdatere turnering" });
    }
});

// Slett mobil turnering (kun oppretteren)
// Fjernet 'beskyttetRute', sjekker userId manuelt
turneringRouter.delete("/api/mobile/turneringer/:id", async (req, res) => {
    try {
        const db = getDb();
        // Sjekker body først, så query-param (?userId=...)
        const userIdInput = req.body.userId || req.query.userId;
        
        const requestUserId = (req.user && req.user._id) ? req.user._id.toString() : userIdInput;

        if (!requestUserId) {
            return res.status(401).json({ error: "Mangler bruker-ID for verifisering." });
        }
        
        const turnering = await db.collection("Turneringer").findOne({ _id: new ObjectId(req.params.id) });
        
        if (!turnering) return res.status(404).json({ error: "Turnering ikke funnet" });

        // Sjekk eierskap
        if (turnering.opprettetAv.toString() !== requestUserId) {
            return res.status(403).json({ error: "Du har ikke tilgang til å slette denne turneringen" });
        }

        const resultat = await db.collection("Turneringer").deleteOne({ _id: new ObjectId(req.params.id) });

        if (resultat.deletedCount === 0) return res.status(404).json({ error: "Turnering ikke funnet" });

        res.status(200).json({ message: "Turnering slettet" });
    } catch (err) {
        console.error("Feil ved sletting av turnering (mobil):", err);
        res.status(500).json({ error: "Kunne ikke slette turnering" });
    }
});


module.exports = turneringRouter;