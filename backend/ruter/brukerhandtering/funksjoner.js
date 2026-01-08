//Author: Laurent Zogaj & Severin Waller Sørensen

/* Denne filen inneholder funksjoner for tilganskontroll og autentisering i API-et.
 * Dette sikrer at kun autoriserte brukere får tilgang til spesefikke deler av systemet.
 */

const { getDb } = require('../../db'); 

//Rute for å sjekke om bruker er aktiv eller ikke, brukes i ulike ruter for enkel sjekk
async function sjekkBrukerAktiv(req, res, next) {
    try { 
        const db = getDb();
        if (!db) return next(new Error("Ingen database tilkobling"));
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "Ingen aktiv session" });
        }
        const bruker = await db.collection('Brukere').findOne({ _id: req.user._id });
        if (!bruker) {
            return res.status(404).json({ error: 'Bruker ikke funnet' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Feil ved henting av brukerdata' });
    }
}

//Sjekk for å beskytte ulike api-ruter som krever en innlogget bruker
function beskyttetRute(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ error: "Du må være logget inn for å få tilgang." });
    }
}

// Sjekke brukerens rolle 
// (parameteren roller = liste over roller som har tilgang til ruten)
// Spurte copilt om å se over koden. Den foreslo å legge til '?' i req.user?.rolle 
// slik at JavaScript ikke vil kaste feil om req.user er undefined eller null.
function sjekkRolle(roller) {
    return (req, res, next) => {
        const brukerRolle = req.user?.rolle; 
        if (!brukerRolle || !roller.includes(brukerRolle)) {
            return res.status(403).json({ error: "Ingen tilgang, kontakt administrator" })
        }
        next();
    }
}

// eksporterer funksjonene slik at de kan brukes i andre filer
module.exports = {sjekkBrukerAktiv, beskyttetRute, sjekkRolle};
