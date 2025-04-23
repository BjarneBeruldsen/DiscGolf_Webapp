//Author: Laurent Zogaj

/* Dette er en viktig fil. Denne filen håndterer validering av ulike inputs.
Dette for å forhindre NoSQLi og XSS angrep. 
Samtidig har vi rate limiting for å stoppe brute force angrep, altså stoppe antall requests fra samme IP.
De ulike konstantene blir så kalt i ulike ruter der man ønsker å validere input.
*/
//https://express-validator.github.io/docs/
//https://www.npmjs.com/package/express-rate-limit

const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

//Kunne egt gjenbrukt en, siden de gjør det samme men gjør det enklere å forstå hva som skjer
//Tidsbegrensning og antall(max) er satt til en litt snillere beskyttelse med tanke på sensur/testing.
const loggeInnStopp = rateLimit({
    windowMs: 30 * 60 * 1000, //30 minutter
    max: 50, //Maks 50 logg inn fra samme IP
    message: { error: "For mange innloggingsforsøk, prøv igjen senere" },
});

const registreringStopp = rateLimit({
    windowMs: 30 * 60 * 1000, //30 minutter
    max: 50, //Maks 50 registreringsforsøk fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

const endringStopp = rateLimit({
    windowMs: 30 * 60 * 1000, //30 minutter
    max: 50, //Maks 50 endringer av bruker fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

const sendingAvMailStopp = rateLimit({
    windowMs: 30 * 60 * 1000, //30 minutter
    max: 50, //Maks 50 requests
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

const nyttPassordStopp = rateLimit({
    windowMs: 30 * 60 * 1000, //30 minutter
    max: 50, //Maks 50 requests
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

//Validering av registering 
const registreringValidering = [
    body('brukernavn')
        .trim()
        .escape()
        .notEmpty().withMessage("Brukernavn må fylles ut.")
        .isLength({ min: 3, max: 15 }).withMessage("Brukernavnet må være mellom 3 og 15 tegn.")
        .isAlphanumeric().withMessage("Brukernavnet kan bare inneholde bokstaver og tall."),
    body('passord')
        .trim()
        .escape()
        .notEmpty().withMessage("Passord må fylles ut.")
        .isLength({ min: 8, max: 20 }).withMessage("Passordet må være minst 8 tegn, maks 20 tegn.")
        .matches(/[A-Z]/).withMessage("Passordet må inneholde minst en stor bokstav.")
        .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn."),
    body ('bekreftPassord')
        .trim()
        .escape()
        .notEmpty().withMessage("Bekreft passord må fylles ut.")
        .isLength({ min: 8, max: 20 }).withMessage("Passordet må være minst 8 tegn, maks 20 tegn.")
        .matches(/[A-Z]/).withMessage("Passordet må inneholde minst en stor bokstav.")
        .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn.")
        //Custom var noe copilot anbefalte dobbelt sjekket dette med docs da jeg ikke hadde fått det med meg at det faktisk var en del av express-validator
        //Custom validering for å sjekke at passordene er like
        .custom((value, { req }) => {
            if (value !== req.body.passord) {
                throw new Error("Passordene må være like.");
            } else {
                return true;
            }
        }
    ),
    body('epost')
        .trim()
        .escape()
        .notEmpty().withMessage("E-post må fylles ut.")
        .isEmail().withMessage("E-post må være gyldig.")
        .normalizeEmail() 
];

//Validering av innlogging
const innloggingValidering = [
    body('brukernavn')
        .trim()
        .escape()
        .notEmpty().withMessage("Brukernavn eller e-post må fylles ut.")
        //Her sjekker vi om det er et gyldig brukernavn eller e-post
        .custom((value) => {
            const erBrukernavn = /^[a-zA-Z0-9]{3,15}$/.test(value);
            const erEpost = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!erBrukernavn && !erEpost) {
                throw new Error("Må være brukernavn (3-15 tegn) eller en gyldig e-post.");
            } else {
            return true;
        }}),
    body('passord')
        .trim()
        .escape()
        .notEmpty().withMessage("Passord må fylles ut.")
        .isLength({ min: 8, max: 20 }).withMessage("Passordet må være minst 8 tegn, maks 20 tegn.")
];

//Validering av redigering
const redigeringValidering = [
    body('nyttBrukernavn')
        .trim()
        .escape()
        .isLength({ min: 3, max: 15 }).withMessage("Nytt brukernavn må være mellom 3 og 15 tegn.")
        .isAlphanumeric().withMessage("Nytt brukernavn kan bare inneholde bokstaver og tall."),
    body('nyEpost')
        .trim()
        .escape()
        .isEmail().withMessage("E-post må være gyldig.")
        .normalizeEmail(),
    body('nyttPassord')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 8, max: 20 }).withMessage("Passordet må være minst 8 tegn, maks 20 tegn.")
        .matches(/[A-Z]/).withMessage("Passordet må inneholde minst én stor bokstav.")
        .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn."),
    //Validerer passord likhet
    body('passord')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        //Copilot generert/foreslått. Sjekker om gammelt passord blir fylt ut
        .custom((value, { req }) => {
            if (req.body.nyttPassord && !value) {
                throw new Error("Du må oppgi ditt gamle passord hvis du vil endre passord.");
            }
            return true;
        }),
    //Ekstra felt
    body(['fornavn', 'etternavn'])
    .optional({ checkFalsy: true, nullable: true }) 
        .trim()
        .escape()
        .matches(/^[a-zA-ZæøåÆØÅ]+$/).withMessage("Navn kan bare inneholde bokstaver.")
        .isLength({ min: 1, max: 50 }).withMessage("Navn må være mellom 1 og 50 tegn."),
    body('telefonnummer')
    .optional({ checkFalsy: true, nullable: true })
        .trim()
        .escape()
        .matches(/^[0-9+\s-]{8,15}$/).withMessage("Telefonnummer må være et gyldig format."),
    body('bosted')
    .optional({ checkFalsy: true, nullable: true })
        .trim()
        .escape()
        .matches(/^[a-zA-ZæøåÆØÅ]+$/).withMessage("Bosted kan bare inneholde bokstaver.")
        .isLength({ min: 1, max: 20 }).withMessage("Bosted må være mellom 1 og 100 tegn.")
];

//Validering av sletting
const sletteValidering = [
    body("brukerInput")
        .trim()
        .escape()
        .notEmpty().withMessage("Brukernavn eller e-post må fylles ut.")
        //Her sjekker vi om det er et gyldig brukernavn eller e-post
        .custom((value) => {
            const erBrukernavn = /^[a-zA-Z0-9]{3,15}$/.test(value);
            const erEpost = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!erBrukernavn && !erEpost) {
                throw new Error("Må være brukernavn (3-15 tegn) eller en gyldig e-post.");
            } else {
                return true;   
        }}),
    body("passord")
        .trim()
        .escape()
        .notEmpty().withMessage("Passord må fylles ut.")
        .isLength({ min: 8, max: 20 }).withMessage("Passordet må være minst 8 tegn, maks 20.")
];
//Validering av nytt passord(glemt passord)
const nyttPassordValidering = [
body("nyttPassord")
    .trim()
    .escape()
    .notEmpty().withMessage("Nytt passord må fylles ut.")
    .isLength({ min: 8, max: 20 }).withMessage("Passordet må være minst 8 tegn, maks 20.")
    .matches(/[A-Z]/).withMessage("Passordet må inneholde minst en stor bokstav.")
    .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn."),
body("bekreftPassord")
    .trim()
    .escape()
    .notEmpty().withMessage("Bekreft passord må fylles ut.")
    .isLength({ min: 8, max: 20 }).withMessage("Passordet må være minst 8 tegn, maks 20.")
    .matches(/[A-Z]/).withMessage("Passordet må inneholde minst en stor bokstav.")
    .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn.")
    //Samme som den tidligere genererte av copilot
    .custom((value, { req }) => {
    if (value !== req.body.nyttPassord) {
        throw new Error("Passordene må være like.");
    } else {
        return true;
    }
}),
];
//Validering av turnering
const turneringValidering = [
    body('navn')
        .trim()
        .escape()
        .matches (/^[a-zA-ZæøåÆØÅ0-9\s-]+$/).withMessage("Bane kan bare inneholde bokstaver, tall og mellomrom.")
        .notEmpty().withMessage("Navn må fylles ut.")
        .isLength({ min: 3, max: 50 }).withMessage("Navnet må være mellom 3 og 50 tegn."),
    body('dato')
        .notEmpty().withMessage("Dato må fylles ut.")
        .isISO8601().withMessage("Dato må være gyldig."),
    body('bane')
        .trim()
        .escape()
        .matches (/^[a-zA-ZæøåÆØÅ0-9\s-]+$/).withMessage("Bane kan bare inneholde bokstaver, tall og mellomrom.")
        .notEmpty().withMessage("Bane må fylles ut."),
    body('beskrivelse')
        .trim()
        .escape()
        .optional({ checkFalsy: true })
        .isLength({ max: 500 }).withMessage("Beskrivelse kan ikke være mer enn 500 tegn.")
        .matches (/^[a-zA-ZæøåÆØÅ0-9\s-.,!?]+$/).withMessage("Beskrivelse kan bare inneholde bokstaver, tall og mellomrom.")
];
//Validering av lagklubb
const lagKlubbValidering = [
    body('klubbnavn')
        .trim()
        .escape()
        .matches (/^[a-zA-ZæøåÆØÅ0-9\s-]+$/).withMessage("Klubbnavn kan bare inneholde bokstaver, tall og mellomrom.")
        .notEmpty().withMessage("Klubbnavn må fylles ut.")
        .isLength({ min: 3, max: 50 }).withMessage("Klubbnavnet må være mellom 3 og 50 tegn."),
    body('kontaktinfo')
        .trim()
        .escape()
        .notEmpty().withMessage("Kontaktinfo må fylles ut.")
        .isEmail().withMessage("E-post må være gyldig.")
        .normalizeEmail(),
];







//Husk å legge til variablene her 
//Eksporterer valideringene 
module.exports = { 
    registreringValidering, 
    innloggingValidering, 
    redigeringValidering, 
    sletteValidering,
    loggeInnStopp,
    registreringStopp,
    endringStopp,
    nyttPassordValidering,
    nyttPassordStopp,
    sendingAvMailStopp,
    turneringValidering,
    lagKlubbValidering
};