//Author: Severin Waller Sørensen

/* Denne filen inneholder funksjoner for å håndtere systemloggdata i databasen.
 * Metodene inkluderer oppretting og henting av systemloggoppføringer.
 * Hver funksjon bruker en MongoDB-databaseforbindelse via getDb().
 */

const { getDb } = require("../db");

let db;

// Initialiserer databasen
function initDb() {
  db = getDb();
}

// Funksjon for å legge til en ny systemloggoppføring
async function leggTilSystemlogg(loggData) {
  if (!db) initDb(); 
  const resultat = await db.collection("Systemlogg").insertOne(loggData);
  return resultat.insertedId;
}

// Funksjon for å hente alle systemloggoppføringer
async function hentAlleSystemlogger() {
  if (!db) initDb();
  return await db.collection("Systemlogg").find().sort({ tidspunkt: -1 }).toArray();
}

// Eksporterer funksjonene slik at de kan brukes i andre filer
module.exports = { leggTilSystemlogg, hentAlleSystemlogger, };