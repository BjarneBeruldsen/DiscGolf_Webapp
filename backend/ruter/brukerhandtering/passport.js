//Author: Laurent Zogaj

/*
Dette er konfigen for Passport.js, som da håndterer autentisering av brukere i selve applikasjonen.
Vi bruker en "lokal strategi" det betyr at brukere logger inn med brukernavn eller e-post og passord.
Passordene hashes (krypteres) og deretter kan også sammenlignes med bcrypt.
MongoDB (nodejs driveren) brukes som database, og vi kan deretter hente brukerinformasjon direkte fra "Brukere" collectionen i databasen vår.
Innkommende brukernavn og e-post blir trimmet og gjort om til små bokstaver for å unngå feil ved sammenligning.
Passport håndterer også sesjoner med serializeUser og deserializeUser:
serializeUser lagrer brukerens ID i session/cookie.
deserializeUser bruker ID-en til å hente full brukerinformasjon fra databasen.
Hele filen blir eksportert og brukes i app.js filen vår i backend.
*/

const { ObjectId } = require('mongodb'); //Importerer ObjectId fra mongodb for å håndtere MongoDB ID-er
const passport = require('passport'); //Importerer passport for autentisering
const LocalStrategy = require('passport-local').Strategy; //Importerer LocalStrategy fra passport-local for lokal autentisering
const bcrypt = require('bcryptjs'); //Importerer bcrypt for å hashe og sammenligne passord
const { getDb } = require('../../db'); //Henter db funksjonen fra db.js filen

//Gjør det mulig for andre filer å hente inn passport konfigen 
module.exports = (passport) => {
//Konfigurasjon av Passport.js https://www.passportjs.org/concepts/authentication/
passport.use(
    new LocalStrategy({ usernameField: "brukernavn", passwordField: "passord" }, //Setter hvilke felt som skal brukes for autentisering
    async (brukernavn, passord, done) => {  //callback funksjon som blir kalt når brukeren prøver å logge inn
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
            //Sjekker om passordet matcher. Bruker da bcrypt
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
        //Lagrer brukerens ID i session/cookie
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
        const bruker = await db.collection("Brukere").findOne({ _id: new ObjectId(String(id)) }); //Copilot foreslo å bruke String(id) for å konvertere id til en streng, tenkte ikke på dette. Brukte hele tiden en deprecated metode som ikke fungerte.

        //Hvis brukeren ikke finnes, returnerer vi en feilmelding
        if (!bruker) {
            return done(null, false, { message: "Bruker ikke funnet" });
        } else {
        //Hvis brukeren blir funnet returnerer vi den
            console.log(`Bruker med ID ${id} logget inn (deserialisering velykket)`);
            return done(null, bruker);
        }
    } catch (err) {
        //Returnerer en feil hvis noe går galt
        console.error("Feil under deserialisering:", err);
        return done(err);
    }
});
};