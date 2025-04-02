//Rute for å sjekke om bruker er aktiv eller ikke, brukes i ulike ruter for enkel sjekk
async function sjekkBrukerAktiv(req, res, next) {
    if (!req.isAuthenticated()) { //Sjekker om brukeren er logget inn
        return res.status(401).json({ error: "Ingen aktiv session" });
    }
    try {
        const bruker = await db.collection('Brukere').findOne({ _id: req.user._id });
        if (!bruker) {
            return res.status(404).json({ error: 'Bruker ikke funnet' });
        }
        next(); //Brukeren er logget inn
    } catch (err) {
        return res.status(500).json({ error: 'Feil ved henting av brukerdata' });
    }
}

//Sjekk for å beskytte ulike api-ruter som krever en innlogget bruker
function beskyttetRute(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); //Brukeren er logget inn
    } else {
        res.status(401).json({ error: "Du må være logget inn for å få tilgang." });
        redirect = "/Innlogging";
    }
}

module.exports = {sjekkBrukerAktiv, beskyttetRute}
