const mongoService = require('./mongo-service');
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'chat';

function query(jesteId) {
	jesteId = new ObjectId(jesteId);
	return mongoService.connect().then(db => {
		return db.collection(dbCol).find({ jeste_id: jesteId }).toArray();
	});
}


function add(msg) {
	msg.fromUserId = new ObjectId(msg.fromUserId);
	msg.toUserId = new ObjectId(msg.toUserId);
	return mongoService.connect().then(db => {
		return db.collection(dbCol).insertOne(msg);
	});
}

function getHistory({ userId, thisUserId }) {
	userId = new ObjectId(userId);
	thisUserId = new ObjectId(thisUserId);
	return mongoService.connect().then(db => {
		return db.collection(dbCol).find({
			$or: [
				{
					$and: [{ fromUserId: userId }, { toUserId: thisUserId }]
				},
				{ $and: [{ fromUserId: thisUserId }, { toUserId: userId }] }
			]
		}).toArray();
	});
}

function markRead(ids, userId, friendId) {
	let filter = ids.reduce((acc, id) => {
		acc.push({ _id: new ObjectId(id) });
		return acc;
	}, []);

	userId = new ObjectId(userId);
	friendId = new ObjectId(friendId);
	mongoService.connect().then(db => {
		return db.collection('chat_list').updateOne(
			{ userId: userId, friendId: friendId },
			{ $set: { unReadCount: 0 } }
		);
	});

	return mongoService.connect().then(db => {
		return db.collection(dbCol).updateMany({ $or: filter }, { $set: { isRead: true } });
	});
}

module.exports = {
	query,
	add,
	// update,
	getHistory,
	markRead,
	updateChatList,
	getChatList
};

function updateChatList({ fromUserId, toUserId, timestamp, data }) {
	fromUserId = new ObjectId(fromUserId);
	toUserId = new ObjectId(toUserId);
	let txt = (data.text) ? data.text.substring(0, 100) : data.emoji

	return mongoService.connect().then(db => {
		var bulk = db.collection('chat_list').initializeOrderedBulkOp();
		bulk.find({ userId: fromUserId, friendId: toUserId })
			.upsert()
			.updateOne({
				$set: { timestamp: timestamp, txt: txt, unReadCount: 0 }
			});
		bulk.find({ userId: toUserId, friendId: fromUserId })
			.upsert()
			.updateOne({
				$set: { timestamp: timestamp, txt: txt },
				$inc: { unReadCount: 1 }
			});
		return bulk.execute();
	});
}

function getChatList(userId) {
	userId = new ObjectId(userId);
	return mongoService.connect().then(db => {
		return db.collection('chat_list').aggregate([
			{ $match: { userId: userId } },
			{ $sort: { timestamp: -1 } },
			{ $skip: 0 },
			{ $limit: 10 },
			{
				$lookup: {
					from: 'user',
					localField: 'friendId',
					foreignField: '_id',
					as: 'chatUser'
				}
			},
			{
				$unwind: { path: '$chatUser' }
			},
			{
				$project: {
					userId: 1,
					friendId: 1,
					timestamp: 1,
					unReadCount: 1,
					txt: 1,
					'chatUser.details': 1,
					'chatUser.img': 1
				}
			}
		]).toArray();
	});
}
