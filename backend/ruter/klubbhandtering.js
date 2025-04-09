//Author: Bjarne Beruldsen

const express = require('express');
const { ObjectId } = require('mongodb');
const { kobleTilDB, getDb } = require('../db'); 
const { beskyttetRute } = require('./brukerhandtering/funksjoner');
const { MongoClient } = require('mongodb');
const klubbRouter = express.Router();

//Klubbhåndterings ruter 
klubbRouter.get('/klubber', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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

klubbRouter.get('/klubber/:id', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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

klubbRouter.post('/klubber', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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

klubbRouter.delete('/klubber/:id', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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

klubbRouter.patch('/klubber/:id', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
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
klubbRouter.post('/klubber/:id/nyheter', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const nyNyhet = {...req.body, _id: new ObjectId()};
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

//rute som legger til bane til git klubb
klubbRouter.post('/klubber/:id/baner', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const nyBane = { ...req.body, _id: new ObjectId() };
        db.collection('Klubb')
        .updateOne(
            { _id: new ObjectId(req.params.id) },
            { $push: { baner: nyBane } }
        )
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved lagring av bane'});
        });
    }
});



//rute for henting av alle nyheter
klubbRouter.get('/nyheterListe', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    let nyheter = []; 
    db.collection('Klubb')
    .find()
    .forEach(klubb => {
        if(klubb.nyheter) {
            klubb.nyheter.forEach(nyhet => nyheter.push(nyhet));
        }
    })
    .then(() => {
        res.status(200).json(nyheter);
    })
    .catch(() => {
        res.status(500).json({error: 'Feil ved henting av nyheter'});
    });
})


//rute for henting av alle baner 
klubbRouter.get('/banerListe', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    let baner = []; 
    db.collection('Klubb')
    .find()
    .forEach(klubb => {
        if(klubb.baner) {
            klubb.baner.forEach(bane => baner.push(bane));
        }
    })
    .then(() => {
        res.status(200).json(baner);
    })
    .catch(() => {
        res.status(500).json({error: 'Feil ved henting av baner'});
    }); 
})

//rute for henting av spesifikk bane 
klubbRouter.get('/baner/:id', async (req, res) => {
    try {
        const db = getDb();
        if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
        const baneId = new ObjectId(req.params.id);
        const klubb = await db.collection('Klubb').findOne({ 'baner._id': baneId }, { projection: { 'baner.$': 1 } });
        
        if (!klubb) {
            return res.status(404).json({ error: 'Bane ikke funnet' });
        }

        const bane = klubb.baner[0];
        const response = {
            ...bane,
            klubbId: klubb._id 
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Feil ved henting av bane' });
    }
});

klubbRouter.patch('/klubber/:klubbId/baner/:baneId', (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    const updates = { ...req.body, _id: new ObjectId(req.params.baneId) };
    if(ObjectId.isValid(req.params.klubbId) === false || ObjectId.isValid(req.params.baneId) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'})
    }
    else {
        db.collection('Klubb')
        .updateOne(
            { _id: new ObjectId(req.params.klubbId), 'baner._id': new ObjectId(req.params.baneId) },
            { $set: { 'baner.$': updates } }
        )
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved oppdatering av bane'})
        })
    }
})

//Rute for å lagre poengkort for en bruker
klubbRouter.post('/brukere/:id/poengkort', async (req, res) => {
    const db = getDb();
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const poengkort = req.body

        db.collection('Brukere')
        .updateOne(
            { _id: new ObjectId(req.params.id) }, 
            { $push: { poengkort: poengkort } },
        )
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved lagring av poengkort'})
        })
    }
})

//Rute for å lagre invitasjoner for en bruker 
klubbRouter.post('/brukere/:id/invitasjoner', async (req, res) => {
    const db = getDb(); 
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const invitasjon = req.body

        db.collection('Brukere')
        .updateOne(
            { _id: new ObjectId(req.params.id) }, 
            { $push: { invitasjoner: invitasjon } },
        )
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved lagring av invitasjon'})
        })
    }
})

//patch for å oppdatere antall varslinger 
klubbRouter.patch('/brukere/:id/varslinger', async (req, res) => {
    const db = getDb(); 
    if (!db) return res.status(500).json({error: 'Ingen database tilkobling'});
    if(ObjectId.isValid(req.params.id) === false) {
        return res.status(400).json({error: 'Ugyldig dokument-id'});
    } else {
        const oppdatering = req.body

        db.collection('Brukere')
        .updateOne(
            { _id: new ObjectId(req.params.id) }, 
            { $set: { varslinger: oppdatering } },
        )
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Feil ved oppdatering av varslinger'})
        })
    }
})



module.exports = klubbRouter;