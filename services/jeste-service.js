const mongoService = require('./mongo-service')
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'toys';

function query(filter) {
    console.log('Filters', filter);

    return mongoService.connect()
        .then(db => {
            var filters = {};
            if (filter) {
                filters = {
                    $and: [
                        {
                            $or: [
                                { name: filter.txt },
                                { type: filter.txt }
                            ]
                        },
                        { inStock: filter.inStock }
                    ]
                }
            }
            return db.collection(dbCol).find({}).toArray()
        })
}

function getById(toyId) {
    toyId = new ObjectId(toyId)
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).findOne({ _id: toyId })
        })
}

function remove(toyId) {
    toyId = new ObjectId(toyId);
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).remove({ _id: toyId })
        })
}

function add(toy) {
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).insertOne(toy)
                .then(result => {
                    toy._id = result.insertedId;
                    return toy;
                })
        })
}

function update(toy) {
    toy._id = new ObjectId(toy._id)
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).updateOne({ _id: toy._id }, { $set: toy })
                .then(result => {
                    return toy;
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