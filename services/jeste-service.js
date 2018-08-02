const mongoService = require('./mongo-service')
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'jeste';

function query(criteria) {
    return mongoService.connect(criteria)
        .then(db => {
            return db.collection(dbCol).aggregate(criteria).toArray()
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
    jeste.req_user_id =  new ObjectId(jeste.req_user_id)
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
    jeste.req_user_id = new ObjectId(jeste.req_user_id)
    if (jeste.res_user_id) jeste.res_user_id = new ObjectId(jeste.res_user_id)
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