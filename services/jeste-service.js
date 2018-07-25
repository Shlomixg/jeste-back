const mongoService = require('./mongo-service')
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'jeste';

function query(filter) {
    console.log('Filters', filter);

    return mongoService.connect()
        .then(db => {
            // var filters = {};
            // if (filter) {
            //     filters = {
            //         $and: [
            //             {
            //                 $or: [
            //                     { name: filter.txt },
            //                     { type: filter.txt }
            //                 ]
            //             },
            //             { inStock: filter.inStock }
            //         ]
            //     }
            // }
            return db.collection(dbCol).find({}).toArray()
        })
}

function getById(jesteId) {
    jesteId = new ObjectId(jesteId)
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).findOne({ _id: jesteId })
        })
}

function remove(jesteId) {
    jesteId = new ObjectId(jesteId);
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).remove({ _id: jesteId })
        })
}

function add(jeste) {
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).insertOne(jeste)
                .then(result => {
                    jeste._id = result.insertedId;
                    return jeste;
                })
        })
}

function update(jeste) {
    jeste._id = new ObjectId(jeste._id)
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).updateOne({ _id: jeste._id }, { $set: jeste })
                .then(result => {
                    return jeste;
                })
        })
}

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}