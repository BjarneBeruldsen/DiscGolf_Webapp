const { MongoClient} = require('mongodb');

let dbKobling; 


module.exports = {
    kobleTilDB: (cb) => {
        MongoClient.connect(process.env.MONGODB_URI)
        .then(client => {
            console.log('Koblet til database');
            dbKobling = client.db();
            return cb();
        })
        .catch(err => {
            console.log('Fanget error: ' + err); 
            return cb(err);
        })
    }, 
    getDb: () => dbKobling, 
}