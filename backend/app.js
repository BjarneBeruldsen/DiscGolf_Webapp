const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require ('bcryptjs');
const { kobleTilDB, getDb } = require('./db'); 
const { ObjectId } = require('mongodb');    
const PORT = process.env.PORT || 8000;
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//Deployment under

//legger serving fra statiske filer fra REACT applikasjonen 
app.use(express.static(path.join(__dirname, '../frontend/build')));

//Deployment over 

//Konfig av session for passport.js
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Oppkobling mot databasen 
let db
kobleTilDB((err) => {
    if(!err) {
        db = getDb();

//Konfigurasjon av Passport.js
passport.use(
    new LocalStrategy({ usernameField: "bruker", passwordField: "passord" }, 
    async (bruker, passord, done) => {
        try {
            const funnetBruker = await db.collection("Brukere").findOne({ bruker: bruker.trim().toLowerCase() });
            if (!funnetBruker) {
                return done(null, false, { message: "Bruker ikke funnet" });
            }

            const passordSjekk = await bcrypt.compare(passord, funnetBruker.passord);
            if (!passordSjekk) {
                return done(null, false, { message: "Feil passord" });
            }

            return done(null, funnetBruker);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((bruker, done) => {
    done(null, bruker._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        if (!ObjectId.isValid(id)) {
            return done(new Error('Ugyldig ObjectId'));
        }
        const bruker = await db.collection("Brukere").findOne({ _id: ObjectId.createFromHexString(id) }); 
        if (!bruker) {
            return done(new Error('Bruker ikke funnet'));
        }
        done(null, bruker);
    } catch (err) {
        done(err);
    }
});

//Start av server
app.listen(PORT, () => {
    console.log('Server kjører på port 8000');
});
    } else {
        console.error("Feil ved oppkobling til databasen", err);
    }
});


//Ulike ruter 
app.get('/klubber', (req, res) => {
    let klubber = []

    db.collection('Klubb')
    .find()
    .forEach(klubb => klubber.push(klubb))
    .then(() => {
        res.status(200).json(klubber)
    })
    .catch(() => {
        res.status(500).json({error: 'Feil ved henting av klubber'})
    })

})

app.get('/klubber/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'})
    }
    else {
        db.collection('Klubb')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved henting av klubb'})
        })
    }
})

app.post('/klubber', (req, res) => {
    const klubb = req.body

    db.collection('Klubb')
    .insertOne(klubb)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'Feil ved lagring av klubb'})  
    })
})

app.delete('/klubber/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'})
    }
    else {
        db.collection('Klubb')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved sletting av klubb'})
        })
    }
})


app.patch('/klubber/:id', (req, res) => {
    const oppdatering = req.body



    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'})
    }
    else {
        db.collection('Klubb')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: oppdatering})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved sletting av klubb'})
        })
    }
})

//Rute som legger nyheter til klubben sin klubbside
app.post('/klubber/:id/nyheter', (req, res) => {
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const nyNyhet = req.body;
        db.collection('Klubb')
        .updateOne(
            { _id: new ObjectId(req.params.id) },
            { $push: { nyheter: nyNyhet } }
        )
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved lagring av nyhet'});
        });
    }
});


//Validering av passord
const passordRegex = /^(?=.*[A-Z])[A-Za-z\d\-.@$!%*?&]{8,}$/;

//Rute for registrering av bruker
app.post("/Registrering", async (req, res) => {
    const { bruker, passord } = req.body;

   if (!bruker || !passord) {
        return res.status(400).json({ error: "Alle felt må fylles ut" });
    }
    if (!passordRegex.test(passord)) {
        return res.status(400).json({ error: "Passordet må være minst 8 tegn, å ha minst en stor bokstav." });
    }

    try {
        const funnetBruker = await db.collection("Brukere").findOne({ bruker: bruker.trim().toLowerCase() });
        if (funnetBruker) {
            return res.status(400).json({ error: "Brukernavnet er allerede tatt" });
        }

        // Kryptering av passord
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passord, salt);

        // Lagrer bruker i databasen
        const nyBruker = { bruker: bruker.trim().toLowerCase(), passord: hashedPassword };
        await db.collection("Brukere").insertOne(nyBruker);

        res.status(201).json({ message: "Bruker registrert" });
    } catch (err) {
        res.status(500).json({ error: "Feil ved registrering" });
    }
});


//Rute for innlogging
app.post("/Innlogging", async (req, res, next) => {
    const { bruker, passord } = req.body;
   if (!bruker || !passord) {
        return res.status(400).json({ error: "Alle felt må fylles ut" });
       }
    passport.authenticate("local", (err, bruker, info) => {
        if (err) {
            return next(err);
        }
        if (!bruker) {
            return res.status(400).json({ error: info.message }); 
        }
        req.logIn(bruker, (err) => {
            if (err) {
                return next(err); 
            }
//Fjerner passord fra brukerobjektet før det sendes til frontend
            const brukerUtenPassord = { id: bruker._id, bruker: bruker.bruker };
            return res.status(200).json({ message: "Innlogging vellykket", bruker: brukerUtenPassord });
        });
    })(req, res, next);
});

//Rute for utlogging
app.post("/Utlogging", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => { 
            res.status(200).json({ message: "Utlogging vellykket" });
        });
    });
});


//Sletting av bruker
//Ila uka

//Tilbakestille testdata
//Ila uka