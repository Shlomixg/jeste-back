const mongoService = require('./mongo-service')
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'chat';

function query(jesteId) {
    jesteId = new ObjectId(jesteId)
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).find({ jeste_id: jesteId }).toArray()
        })
}

function add(jesteId) {
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).insertOne({ jeste_id: jesteId, chat_history: [] })
        })
}

function update({ msg, jesteId }) {
    jesteId = new ObjectId(jesteId)
    msg.authorId = new ObjectId(msg.authorId)
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).insertOne({ jeste_id: jesteId, msg })
        })
}

module.exports = {
    query,
    add,
    update
}