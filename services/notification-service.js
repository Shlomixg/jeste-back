const mongoService = require('./mongo-service');
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'notification';

function query(userId) {
	userId = new ObjectId(userId);
	return mongoService.connect().then(db => {
		return db
			.collection(dbCol)
			.find({ userId: userId })
			.sort({ timestamp: -1 })
			.toArray();
	});
}

function add(notification) {
	console.log('adding notifiy');

	return mongoService.connect().then(db => {
		return db
			.collection(dbCol)
			.insertOne(notification)
			.then(result => {
				console.log('notification add', result);

				return result;
			});
	});
}
function markRead(ids, userId, friendId) {
	let filter = ids.reduce((acc, id) => {
		acc.push({ _id: new ObjectId(id) });
		return acc;
	}, []);


	return mongoService.connect().then(db => {
		return db
			.collection(dbCol)
			.updateMany({ $or: filter }, { $set: { isRead: true } });
	});
}


module.exports = {
	query,
	add,
	markRead
};
