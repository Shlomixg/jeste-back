const mongoService = require('./mongo-service')
const ObjectId = require('mongodb').ObjectId;
const dbCollection = 'user';

// function checkLogin({ nickname }) {
//     return mongoService.connect()
//         .then(db => db.collection('user').findOne({ nickname }))
// }

function query(loggedNickname = null) {
    return mongoService.connect()
        .then(db => {
            if (loggedNickname) return db.collection(dbCollection).findOne(loggedNickname);
            else return db.collection(dbCollection).find({}).toArray()

        })
}

function checkLogin(user) {
    return mongoService.connect()
        .then(db => db.collection('user').findOne({ $and: [{ email: user.email }, { password: user.password }] }))
}

// function getById(userId) {
//     userId = new ObjectId(userId)
//     return mongoService.connect()
//         .then(db => {
//             const collection = db.collection(dbCollection);
//             return collection.findOne({ _id: userId })
//         })
// }

// function remove(userId) {
//     userId = new ObjectId(userId);
//     return mongoService.connect()
//         .then(db => {
//             const collection = db.collection(dbCollection);
//             return collection.remove({ _id: userId })
//         })
// }

// function add(user) {
//     return mongoService.connect()
//         .then(db => {
//             const collection = db.collection(dbCollection);
//             return collection.insertOne(user)
//                 .then(result => {
//                     user._id = result.insertedId;
//                     return user;
//                 })
//         })
// }

// function update(user) {
//     user._id = new ObjectId(user._id)
//     return mongoService.connect()
//         .then(db => {
//             const collection = db.collection(dbCollection);
//             return collection.updateOne({ _id: user._id }, { $set: user })
//                 .then(result => {
//                     return user;
//                 })
//         })
// }

module.exports = {
    query,
    checkLogin
    // getById,
    // remove,
    // add,
    // update
}