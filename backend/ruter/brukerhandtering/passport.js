const { ObjectId } = require('mongodb'); 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { getDb } = require('../../db');

//Gjør det mulig for andre filer å hente inn passport konfigen 
module.exports = (passport) => {
//Konfigurasjon av Passport.js https://www.passportjs.org/concepts/authentication/
passport.use(
    new LocalStrategy({ usernameField: "brukernavn", passwordField: "passord" }, 
    async (brukernavn, passord, done) => {  
        try {
            const db = getDb();
            if (!db) return done(new Error("Ingen database tilkobling"));
            //Sjekker om brukeren finnes i databasen (brukernavn eller e-post)
            const funnetBruker = await db.collection("Brukere").findOne({
            $or: [
                { brukernavn: brukernavn.trim().toLowerCase() },
                { epost: brukernavn.trim().toLowerCase() }
                ]
            });
            if (!funnetBruker) {
                return done(null, false, { message: "Brukernavn eller e-post ikke funnet" });
            }
            const passordSjekk = await bcrypt.compare(passord, funnetBruker.passord);
            if (!passordSjekk) {
                return done(null, false, { message: "Feil passord eller brukernavn" });
            }
            else {
                //Hvis innloggingen er vellykket, returnerer vi brukeren
                return done(null, funnetBruker);
            }
        } catch (err) {
            //Returnerer en feil hvis noe går galt
            return done(err);
        }
    })
);
//Serialiserer brukeren ved å lagre brukerens ID i session
passport.serializeUser((bruker, done) => {
    try {
        const db = getDb();
        if (!db) return done(new Error("Ingen database tilkobling"));
        done(null, bruker._id);
        console.log(`Bruker med ID ${bruker._id} logget inn (serialisering velykket)`);
    } catch (err) { 
        console.error("Feil under serialisering:", err);
        done(err);
    }
});
//Deserialiserer brukeren ved å hente brukerdata fra databasen basert på ID
passport.deserializeUser(async (id, done) => {
    try {
        const db = getDb();
        if (!db) return done(new Error("Ingen database tilkobling"));
        //Sjekker om id er gyldig
        if (!ObjectId.isValid(id)) {
            return done(null, false, { message: "Ugyldig dokument-id" });
        }
        //Henter brukeren fra databasen
        const bruker = await db.collection("Brukere").findOne({ _id: new ObjectId(String(id)) });

        //Hvis brukeren ikke finnes, returnerer vi en feilmelding
        if (!bruker) {
            return done(null, false, { message: "Bruker ikke funnet" });
        } else {
        //Hvis brukeren blir funnet returnerer vi den
            return done(null, bruker);
        }
    } catch (err) {
        //Returnerer en feil hvis noe går galt
        console.error("Feil under deserialisering:", err);
        return done(err);
    }
});
};