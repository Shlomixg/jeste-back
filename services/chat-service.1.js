const mongoService = require('./mongo-service');
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'chat';

function query(jesteId) {
	jesteId = new ObjectId(jesteId);
	return mongoService.connect().then(db => {
		return db
			.collection(dbCol)
			.find({ jeste_id: jesteId })
			.toArray();
	});
}

function add(jesteId) {
	return mongoService.connect().then(db => {
		return db
			.collection(dbCol)
			.insertOne({ jeste_id: jesteId, chat_history: [] });
	});
}

function update({ msg, jesteId }) {
	jesteId = new ObjectId(jesteId);
	msg.authorId = new ObjectId(msg.authorId);
	return mongoService.connect().then(db => {
		return db.collection(dbCol).insertOne({ jeste_id: jesteId, msg });
	});
}

function getHistory({ userId, thisUserId }) {
	userId = new ObjectId(userId);
	thisUserId = new ObjectId(thisUserId);
	return mongoService.connect().then(db => {
		return db
			.collection(dbCol)
			.find({
				$or: [
					{
						$and: [{ fromUserId: userId }, { toUserId: thisUserId }]
					},
					{ $and: [{ fromUserId: thisUserId }, { toUserId: userId }] }
				]
			})
			.toArray();
	});
}

module.exports = {
	query,
	add,
    update,
    getHistory
};
