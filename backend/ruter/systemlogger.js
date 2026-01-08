//Author: Severin Waller Sørensen
//Changed by: Laurent Zogaj

/* Denne filen definerer API-ruter for å håndtere systemlogg.
 * Den håndterer logging av hendelser og henting av systemloggdata.
 */

const express = require("express");
const { getDb } = require("../db");
const { beskyttetRute, sjekkRolle } = require("./brukerhandtering/funksjoner");

const systemloggRouter = express.Router();

// Legg til en ny systemloggoppføring
systemloggRouter.post("/", async (req, res) => {
    const db = getDb();
    const { bruker, handling, detaljer } = req.body;

    // Sjekk at nødvendige felt er inkludert
    if (!bruker || !handling) {
      return res.status(400).json({ error: "Bruker og handling er påkrevd" });
    }

    try {
      const nyLogg = {
        tidspunkt: new Date(),
        bruker,
        handling,
        detaljer: detaljer || "Ingen detaljer",
      };

      const resultat = await db.collection("Systemlogg").insertOne(nyLogg);
      res.status(201).json({ _id: resultat.insertedId, ...nyLogg });
    } catch (error) {
      console.error("Feil ved logging av systemhendelse:", error.message);
      res.status(500).json({ error: "Kunne ikke logge hendelsen" });
    }
  }
);

// Hent alle systemloggoppføringer
systemloggRouter.get("/", async (req, res) => {
    const db = getDb();

    try {
      const systemlogg = await db.collection("Systemlogg").find().toArray();
      res.status(200).json(systemlogg);
    } catch (error) {
      console.error("Feil ved henting av systemlogg:", error.message);
      res.status(500).json({ error: "Kunne ikke hente systemlogg" });
    }
  }
);

// Slett alle systemloggoppføringer (kun for hoved-admin)
systemloggRouter.delete("/", beskyttetRute, sjekkRolle(["hoved-admin"]), async (req, res) => {
    const db = getDb();

    try {
      const resultat = await db.collection("Systemlogg").deleteMany({});
      
      // Logg at systemloggen ble tømt
      await db.collection("Systemlogg").insertOne({
        tidspunkt: new Date(),
        bruker: req.user.brukernavn,
        handling: "Tømte systemlogg",
        detaljer: `Admin '${req.user.brukernavn}' tømte systemloggen. ${resultat.deletedCount} oppføringer ble slettet.`
      });

      res.status(200).json({ 
        message: "Systemlogg tømt", 
        slettetAntall: resultat.deletedCount 
      });
    } catch (error) {
      console.error("Feil ved sletting av systemlogg:", error.message);
      res.status(500).json({ error: "Kunne ikke tømme systemlogg" });
    }
  }
);

// Eksporter routeren
module.exports = systemloggRouter;