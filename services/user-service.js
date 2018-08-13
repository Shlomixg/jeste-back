const mongoService = require('./mongo-service');
const ObjectId = require('mongodb').ObjectId;
const dbCollection = 'user';

function query(id = null) {
	let criteria = {};
	if (id) {
		id = new ObjectId(id);
		criteria = [
			{
				$match: { _id: id }
			},
			{
				$lookup: {
					from: 'jeste',
					localField: '_id',
					foreignField: 'req_user_id',
					as: 'req_jestes'
				}
			},
			{
				$lookup: {
					from: 'jeste',
					localField: '_id',
					foreignField: 'res_user_id',
					as: 'res_jestes'
				}
			}
		];
	}
	return mongoService.connect().then(db => {
		if (id) return db.collection(dbCollection).aggregate(criteria).toArray();
		else return db.collection(dbCollection).find({}).toArray();
	});
}

function getUserById(id) {
	id = ObjectId(id);
	return mongoService.connect().then(db => {
		return db.collection(dbCollection).findOne({ _id: id });
	});
}

function checkLogin(user) {
	return mongoService.connect().then(db =>
		db.collection('user').findOne({ $and: [{ email: user.email }, { password: user.password }] })
	);
}

// function remove(userId) {
//     userId = new ObjectId(userId);
//     return mongoService.connect()
//         .then(db => {
//             const collection = db.collection(dbCollection);
//             return collection.remove({ _id: userId })
//         })
// }

function add(user) {
	return mongoService.connect()
		.then(db => {
			const collection = db.collection(dbCollection);
			return collection.insertOne(user)
				.then(result => {
					user._id = result.insertedId;
					return user;
				})
		})
}

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
	getUserById,
	checkLogin,
	add
	// getById,
	// remove,
	// update
};
