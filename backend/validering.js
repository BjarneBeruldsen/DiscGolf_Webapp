//Author: Laurent Zogaj
//Valideringer med express-validator https://express-validator.github.io/docs/
//Rate limit for å stoppe brute force angrep https://www.npmjs.com/package/express-rate-limit
//Valideringer som legges til i ruter for å sjekke ulike inputer og stoppe for mange forespørsler og forsøk

const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const loggeInnStopp = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutter
    max: 10, //Maks 10 logg inn fra samme IP
    message: { error: "For mange innloggingsforsøk, prøv igjen senere" },
});

const registreringStopp = rateLimit({
    windowMs: 60 * 60 * 1000, //1 time 
    max: 10, //Maks 10 registreringsforsøk fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

const endringStopp = rateLimit({
    windowMs: 60 * 60 * 1000, //1 time 
    max: 10, //Maks 10 endringer av bruker fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});


//Validering av registering 
const registreringValidering = [
    body('brukernavn')
        .trim()
        .isLength({ min: 3, max: 15 }).withMessage("Brukernavnet må være mellom 3 og 15 tegn.")
        .isAlphanumeric().withMessage("Brukernavnet kan bare inneholde bokstaver og tall."),
    body('passord')
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
        .matches(/[A-Z]/).withMessage("Passordet må inneholde minst en stor bokstav.")
        //.matches(/[0-9]/).withMessage("Passordet må inneholde minst ett tall.") //Ikke gyldig med passord for admin/test for prosjektet
        .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn."),
    body('epost')
        .trim()
        .isEmail().withMessage("E-post må være gyldig.")
        .normalizeEmail() 
];

//Validering av innlogging
const innloggingValidering = [
    body('brukernavn')
        .trim()
        .notEmpty().withMessage("Brukernavn eller e-post må fylles ut.")
        .custom((value) => {
            const erBrukernavn = /^[a-zA-Z0-9]{3,15}$/.test(value);
            const erEpost = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!erBrukernavn && !erEpost) {
                throw new Error("Må være brukernavn (3-15 tegn) eller en gyldig e-post.");
            }
            return true;
        }),
    body('passord')
        .notEmpty().withMessage("Passord må fylles ut.")
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
];

//Validering av redigering
const redigeringValidering = [
    body('brukernavn')
        .optional()
        .trim()
        .isLength({ min: 3, max: 15 }).withMessage("Brukernavnet må være mellom 3 og 15 tegn.")
        .isAlphanumeric().withMessage("Brukernavnet kan bare inneholde bokstaver og tall."),
    body('epost')
        .optional()
        .trim()
        .isEmail().withMessage("E-post må være gyldig.")
        .normalizeEmail(),
    body('nyttPassord')
        .optional()
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
        .matches(/[A-Z]/).withMessage("Passordet må inneholde minst én stor bokstav.")
        .matches(/[-.@$!%*?&]/).withMessage("Passordet må inneholde minst ett spesialtegn."),
    body('gammelPassord')
        .optional()
        .notEmpty().withMessage("Du må oppgi ditt gamle passord hvis du vil endre passord.")
        .custom((value, { req }) => {
            if (req.body.nyttPassord && !value) {
                throw new Error("Gamle passord må oppgis for å endre passord.");
            }
            return true;
        })
];

//Validering av sletting
const sletteValidering = [
    body("brukerInput")
        .trim()
        .notEmpty().withMessage("Brukernavn eller e-post må fylles ut.")
        .custom((value) => {
            const erBrukernavn = /^[a-zA-Z0-9]{3,15}$/.test(value);
            const erEpost = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!erBrukernavn && !erEpost) {
                throw new Error("Må være brukernavn (3-15 tegn) eller en gyldig e-post.");
            }
            return true;
        }),
    body("passord")
        .notEmpty().withMessage("Passord må fylles ut.")
        .isLength({ min: 8 }).withMessage("Passordet må være minst 8 tegn.")
];
//Andre valideringer her






//Husk å legge til variablene her 
module.exports = { 
    registreringValidering, 
    innloggingValidering, 
    redigeringValidering, 
    sletteValidering,
    loggeInnStopp,
    registreringStopp,
    endringStopp
};