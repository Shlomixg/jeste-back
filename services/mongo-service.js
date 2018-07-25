var dbConn = null;

const dbName = 'jeste_db';
const PROD_URL = 'mlab-url';

function connectToMongo() {
    // Reuse existing connection if exist
    if (dbConn) return Promise.resolve(dbConn);
    const MongoClient = require('mongodb').MongoClient;
    const url = (!process.env.PORT) ? `mongodb://localhost:27017/${dbName}` : PROD_URL;

    return MongoClient.connect(url)
        .then(client => {
            console.log('Connected to MongoDB');
            // If we get disconnected (e.g. db is down)
            client.on('close', () => {
                console.log('MongoDB Diconnected');
                dbConn = null;
            }); 
            dbConn = client.db();
            return dbConn;
        })
}

module.exports = {
    connect: connectToMongo
}