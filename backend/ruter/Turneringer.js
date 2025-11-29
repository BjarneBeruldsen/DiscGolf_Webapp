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
// Fjernet 'beskyttetRute', sjekker userId manuelt
turneringRouter.post("/api/mobile/turneringer", mobilTurneringOpprettelseStopp, mobileTurneringValidering, async (req, res) => {
    const db = getDb();
    const { navn, dato, beskrivelse, sted, adresse, deltakere, premiepott, kontakt, userId } = req.body;
    
    // Fallback: Bruker session hvis tilgjengelig, ellers userId fra appen
    let oppretterId = (req.user && req.user._id) ? req.user._id : userId;

    if (!oppretterId) {
        return res.status(401).json({ error: "Mangler bruker-ID. Du må være logget inn." });
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

// Slett turnering
turneringRouter.delete("/api/mobile/turneringer/:id", async (req, res) => {
    try {
        const db = getDb();
        
        // 1. SIKRERE ID-SJEKK:
        // Sjekker om ID-en ser ut som en gyldig MongoDB ID før vi prøver å bruke den
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Ugyldig turnering-ID format" });
        }

        // 2. SIKRERE BRUKER-SJEKK:
        // Vi bruker ?. (optional chaining) i tilfelle req.body er undefined
        // Android sender 'userId' i query (URL), så vi sjekker den først/også.
        const userIdInput = req.query.userId || (req.body && req.body.userId);
        
        // Sjekker session først, deretter input fra appen
        const requestUserId = (req.user && req.user._id) ? req.user._id.toString() : userIdInput;

        if (!requestUserId) {
            console.log("Sletting feilet: Mangler userId");
            return res.status(401).json({ error: "Mangler bruker-ID for verifisering." });
        }
        
        // Hent turneringen
        const turnering = await db.collection("Turneringer").findOne({ _id: new ObjectId(req.params.id) });
        
        if (!turnering) {
            return res.status(404).json({ error: "Turnering ikke funnet" });
        }

        // 3. SJEKK OM ID MATCHER (String sammenligning):
        // Vi konverterer begge til string for å være helt sikre
        const eierId = turnering.opprettetAv.toString();
        const requesterIdString = requestUserId.toString();

        if (eierId !== requesterIdString) {
            console.log(`Sletting nektet. Eier: ${eierId}, Forsøkte: ${requesterIdString}`);
            return res.status(403).json({ error: "Du har ikke tilgang til å slette denne turneringen" });
        }

        // Slett
        const resultat = await db.collection("Turneringer").deleteOne({ _id: new ObjectId(req.params.id) });

        if (resultat.deletedCount === 0) {
            return res.status(404).json({ error: "Kunne ikke slette (ikke funnet)" });
        }

        res.status(200).json({ message: "Turnering slettet" });

    } catch (err) {
        // Her ser du den faktiske feilen i server-loggen din
        console.error("KRITISK FEIL ved sletting:", err); 
        res.status(500).json({ error: "Intern serverfeil: " + err.message });
    }
});



// Meld på bruker til turnering (MOBILE)
turneringRouter.post("/api/mobile/turneringer/:id/pamelding", async (req, res) => {
    try {
        const db = getDb();
        const turneringId = req.params.id;
        const { userId } = req.body; 

        if (!ObjectId.isValid(turneringId)) {
            return res.status(400).json({ error: "Ugyldig turnering-ID" });
        }

        if (!userId) {
            return res.status(401).json({ error: "Mangler bruker-ID" });
        }


        const turnering = await db.collection("Turneringer").findOne({ _id: new ObjectId(turneringId) });
        if (!turnering) {
            return res.status(404).json({ error: "Turnering ikke funnet" });
        }

        const erAlleredePameldt = turnering.registreringer && turnering.registreringer.some(reg => reg.userId === userId);
        
        if (erAlleredePameldt) {
            return res.status(400).json({ error: "Du er allerede påmeldt denne turneringen" });
        }

 
        const antallPameldte = turnering.registreringer ? turnering.registreringer.length : 0;
        if (turnering.deltakere && antallPameldte >= turnering.deltakere) {
            return res.status(400).json({ error: "Turneringen er full" });
        }

 
        let brukerNavn = "Ukjent";
        try {
            if (ObjectId.isValid(userId)) {
                const bruker = await db.collection("Brukere").findOne({ _id: new ObjectId(userId) });
                if (bruker) brukerNavn = bruker.brukernavn || bruker.fornavn;
            }
        } catch (e) {
            console.log("Kunne ikke hente brukernavn, fortsetter med ID");
        }

        const nyRegistrering = {
            userId: userId,
            navn: brukerNavn,
            dato: new Date()
        };

        await db.collection("Turneringer").updateOne(
            { _id: new ObjectId(turneringId) },
            { $push: { registreringer: nyRegistrering } }
        );

        res.status(200).json({ message: "Du er nå påmeldt!" });

    } catch (err) {
        console.error("Feil ved påmelding:", err);
        res.status(500).json({ error: "Kunne ikke melde på turnering" });
    }
});








module.exports = turneringRouter;