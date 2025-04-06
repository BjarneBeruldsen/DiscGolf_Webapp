//Author: Severin Waller Sørensen

const express = require("express");
const { getDb } = require("../db");
const { ObjectId } = require("mongodb");
const { beskyttetRute, sjekkRolle } = require("./brukerhandtering/funksjoner");

const turneringRouter = express.Router();

// POST /api/turneringer - Opprett ny turnering
turneringRouter.post("/api/turneringer", beskyttetRute, sjekkRolle(["klubbleder", "admin", "hoved-admin"]), async (req, res) => {
    const db = getDb();
    const { navn, dato, bane, beskrivelse } = req.body;

    if (!navn || !dato || !bane) {
      return res.status(400).json({ error: "Mangler påkrevde felt" });
    }

    try {
      const nyTurnering = {
        navn,
        dato,
        bane,
        beskrivelse,
        opprettetAv: req.user._id, // Hvem som laget turneringen
      };
      const resultat = await db.collection("Turneringer").insertOne(nyTurnering);
      res.status(201).json({ _id: resultat.insertedId, ...nyTurnering });
    } catch (error) {
      console.error("Feil:", error.message);
      res.status(500).json({ error: "Kunne ikke opprette turnering" });
    }
  }
);

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
