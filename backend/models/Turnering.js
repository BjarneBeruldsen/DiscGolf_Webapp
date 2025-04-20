//Author: Severin Waller Sørensen

/* Denne filen inneholder funksjoner for å håndtere turneringer i databasen
 * Metodene er for å opprette, hente, oppdatere og slette turneringer. dvs. CRUD-operasjoner
 * Hver av funksjonene bruker/initialseres en MongoDB-databaseforbindelse.
 */

const { getDb } = require("../db");

let db;

// Setter opp en forbindele til databasen
// Bruker getDb() importert fra db.js for å få tilgang til databasen
function initDb() {
  db = getDb();
}

// Funksjon for å lage en ny turnering
async function lagTurnering(turneringData) {
  if (!db) initDb(); // Sikrer at DB er satt
  const resultat = await db.collection("Turneringer").insertOne(turneringData);
  return resultat.insertedId;
}

// Funksjon for å hente turneringer
// (NB, her blir alle hentet. må definere en ny metode om én bestemt skal hentes)
async function hentAlleTurneringer() {
  if (!db) initDb();
  return await db.collection("Turneringer").find().toArray();
}

// Oppdaterer en turnering
// Spurt copilot om hjelp til å lage denne funksjonen
async function oppdaterTurnering(id, oppdateringer) {
  if (!db) initDb();
  const { ObjectId } = require("mongodb");
  return await db.collection("Turneringer").updateOne(
    { _id: new ObjectId(id) },
    { $set: oppdateringer }
  );
}

// Sletter en turnering fra databasen
// Spurt copilot om hjelp til å lage denne funksjonen
async function slettTurnering(id) {
  if (!db) initDb();
  const { ObjectId } = require("mongodb");
  return await db.collection("Turneringer").deleteOne({ _id: new ObjectId(id) });
}

// eksporterer funksjonene slik at de kan brukes i andre filer
module.exports = { lagTurnering,
   hentAlleTurneringer, hentTurneringVedId,
   oppdaterTurnering, slettTurnering,
};
