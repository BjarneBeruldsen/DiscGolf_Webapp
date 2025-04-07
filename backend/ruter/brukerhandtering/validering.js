//Author: Laurent Zogaj
//Valideringer med express-validator https://express-validator.github.io/docs/
//Rate limit for å stoppe brute force angrep https://www.npmjs.com/package/express-rate-limit
//Valideringer som legges til i ruter for å sjekke ulike inputer og stoppe for mange forespørsler og forsøk

const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const loggeInnStopp = rateLimit({
    windowMs: 60 * 60 * 1000, //15 minutter
    max: 25, //Maks 10 logg inn fra samme IP
    message: { error: "For mange innloggingsforsøk, prøv igjen senere" },
});

const registreringStopp = rateLimit({
    windowMs: 2 * 60 * 60 * 1000, //1 time 
    max: 25, //Maks 10 registreringsforsøk fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

const endringStopp = rateLimit({
    windowMs: 2 * 60 * 60 * 1000, //1 time 
    max: 25, //Maks 10 endringer av bruker fra samme IP
    message: { error: "For mange registreringsforsøk, prøv igjen senere" },
});

const nyttPassordStopp = rateLimit({
    windowMs: 2* 60 * 60 * 1000, //1 time
    max: 25, //Maks 10 endringer av passord fra samme IP
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
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 3, max: 15 }).withMessage("Nytt brukernavn må være mellom 3 og 15 tegn.")
        .isAlphanumeric().withMessage("Nytt brukernavn kan bare inneholde bokstaver og tall."),
    body('nyEpost')
        .optional({ checkFalsy: true })
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
        .custom((value, { req }) => {
            if (req.body.nyttPassord && !value) {
                throw new Error("Du må oppgi ditt gamle passord hvis du vil endre passord.");
            }
            return true;
        }),
    //Ekstra felt
    body(['fornavn', 'etternavn'])
        .optional({ checkFalsy: true })
        .optional({ nullable: true })
        .trim()
        .escape()
        .isLength({ min: 1, max: 50 }).withMessage("Navn må være mellom 1 og 50 tegn."),
    body('telefonnummer')
        .optional({ checkFalsy: true })
        .optional({ nullable: true })
        .trim()
        .escape()
        .matches(/^[0-9+\s-]{8,15}$/).withMessage("Telefonnummer må være et gyldig format."),
    body('bosted')
        .optional({ checkFalsy: true })
        .optional({ nullable: true })
        .trim()
        .escape()
        .isLength({ min: 1, max: 20 }).withMessage("Bosted må være mellom 1 og 100 tegn.")
];

//Validering av sletting
const sletteValidering = [
    body("brukerInput")
        .trim()
        .escape()
        .notEmpty().withMessage("Brukernavn eller e-post må fylles ut.")
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
    .custom((value, { req }) => {
    if (value !== req.body.nyttPassord) {
        throw new Error("Passordene må være like.");
    } else {
        return true;
    }
}),
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
    endringStopp,
    nyttPassordValidering,
    nyttPassordStopp
};