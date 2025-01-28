const express = require('express');
const cors = require('cors');
const { kobleTilDB, getDb } = require('./db'); 
const { ObjectId } = require('mongodb');    
const PORT = process.env.PORT || 8000;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//Oppkobling mot databasen 
let db
kobleTilDB((err) => {
    if(!err) {
        app.listen(PORT, () => {
            console.log('Server kjører på port 8000');
        })
        db = getDb();
    }
})


//ulike ruter 
app.get('/klubber', (req, res) => {
    const page = req.query.p || 0 
    const klubberPrSide = 1

    let klubber = []; 
    
    db.collection('Klubb')
    .find() 
    .sort({navn: 1})
    .skip(page * klubberPrSide)
    .limit(klubberPrSide)
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