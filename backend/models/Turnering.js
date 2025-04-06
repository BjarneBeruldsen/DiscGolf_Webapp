//Author: Severin Waller Sørensen

const { getDb } = require("../db");

let db;

// Initialiserer databasen
function initDb() {
  db = getDb();
}

// Lager en ny turnering
async function lagTurnering(turneringData) {
  if (!db) initDb(); // Sikrer at DB er satt
  const resultat = await db.collection("Turneringer").insertOne(turneringData);
  return resultat.insertedId;
}

// Henter alle turneringer
async function hentAlleTurneringer() {
  if (!db) initDb();
  return await db.collection("Turneringer").find().toArray();
}

// Henter én turnering basert på ID (valgfritt hvis du trenger det)
async function hentTurneringVedId(id) {
  if (!db) initDb();
  const { ObjectId } = require("mongodb");
  return await db.collection("Turneringer").findOne({ _id: new ObjectId(id) });
}

// Oppdaterer en turnering
async function oppdaterTurnering(id, oppdateringer) {
  if (!db) initDb();
  const { ObjectId } = require("mongodb");
  return await db.collection("Turneringer").updateOne(
    { _id: new ObjectId(id) },
    { $set: oppdateringer }
  );
}

// Sletter en turnering
async function slettTurnering(id) {
  if (!db) initDb();
  const { ObjectId } = require("mongodb");
  return await db.collection("Turneringer").deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  lagTurnering,
  hentAlleTurneringer,
  hentTurneringVedId,
  oppdaterTurnering,
  slettTurnering,
};
