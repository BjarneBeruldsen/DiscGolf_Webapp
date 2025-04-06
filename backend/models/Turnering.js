//Author: Severin Waller Sørensen

const mongoose = require('mongoose');

// Definer schema for turneringer
const turneringSchema = new mongoose.Schema({
  navn: { type: String, required: true },
  dato: { type: Date, required: true },
  bane: { type: String, required: true },
  beskrivelse: { type: String, required: true },
});

// Lag en Mongoose-modell basert på schemaet
const Turnering = mongoose.model('Turnering', turneringSchema);

// Eksporter modellen for bruk i andre filer
module.exports = Turnering;
