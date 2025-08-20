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
const { turneringValidering } = require("./brukerhandtering/validering");
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
