const { MongoClient} = require('mongodb');

let dbKobling; 
module.exports = {
    kobleTilDB: (cb) => {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI er ikke definert i miljøvariabler');
            return cb(new Error('MONGODB_URI mangler'));
        }
        
        MongoClient.connect(process.env.MONGODB_URI)
        .then(client => {
            console.log('Koblet til MongoDB');
            const uriParts = process.env.MONGODB_URI.split('/');
            const dbName = uriParts[uriParts.length - 1]?.split('?')[0];
            if (!dbName) {
                console.error('Kunne ikke hente databasenavn fra MONGODB_URI');
                return cb(new Error('Ugyldig MONGODB_URI: mangler databasenavn'));
            }
            dbKobling = client.db(dbName);
            console.log(`Bruker MongoDB database: ${dbName}`);
            return cb();
        })
        .catch(err => {
            console.error('Feil ved tilkobling til MongoDB:', err); 
            return cb(err);
        })
    }, 
    getDb: () => dbKobling, 
}