'use strict';

var dbConn = null;

const dbName = 'jeste_db';
const PROD_URL = 'mongodb://itaishlomi:jeste123@ds247061.mlab.com:47061/' + dbName;

function connectToMongo() {
    // Reuse existing connection if exist
    if (dbConn) return Promise.resolve(dbConn);
    const MongoClient = require('mongodb').MongoClient;
    const url = (false) ? `mongodb://localhost:27017/${dbName}` : PROD_URL;

    return MongoClient.connect(url, { useNewUrlParser: true })
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