const jesteService = require('./jeste-service');
const chatSerivce = require('./chat-service');
const notificationService = require('./notification-service');
const ObjectId = require('mongodb').ObjectId;
var loggedUsers = {};

function socket(socket, io) {
	socket.on('userLogged', ({ userId }) => {
		console.log('Logged', userId);
		console.log('Logged list', loggedUsers);

		loggedUsers[userId] = socket.id;
		console.log('Loggged user after assign', loggedUsers);
	});

	socket.on('jesteResponded', ({ jeste, user }) => {
		let jesteId = jeste._id;
		socket.join(jesteId);
		delete jeste.req_user;
		delete jeste.res_user;
		jesteService.update(jeste)
			.then(_ => {
				let notification = {
					userId: new ObjectId(jeste.req_user_id),
					friendId: new ObjectId(user._id),
					jesteId: new ObjectId(jeste._id),
					img: jeste.img.secure_url,
					txt: `${user.details.firstName} ${user.details.lastName} just responded your Jeste!`,
					timestamp: Date.now(),
					isRead: false,
				}
				notificationService.add(notification)
					.then(result => {
						let socketId = loggedUsers[jeste.req_user_id];

						if (socketId) {
							notification._id = result.insertedId;

							io.to(`${socketId}`).emit('receivedNotification', notification);
						}
					})
			});
	});

	socket.on('sendMsg', msg => {
		chatSerivce.add(msg)
			.then(result => {
				chatSerivce.updateChatList(msg)
				if (loggedUsers[msg.toUserId]) {
					console.log('Emit sent');
					msg._id = result.insertedId;
					let socketId = loggedUsers[msg.toUserId];
					io.to(`${socketId}`).emit('receivedMsg', msg);
				}
			})
			.catch(err => console.log('Error occured', err))
	});

	socket.on('isTyping', ({ fromUserId, toUserId }) => {
		if (loggedUsers[toUserId]) {
			io.to(`${loggedUsers[toUserId]}`).emit('isTyping', { fromUserId, toUserId });
		}
	});

	socket.on('logOut', function () {
		for (let userId in loggedUsers) {
			if ((loggedUsers[userId] = socket.id)) {
				delete loggedUsers[userId];
				return;
			}
		}
	});

	socket.on('disconnect', function () {
		console.log('Disconnected');

		for (let userId in loggedUsers) {
			if ((loggedUsers[userId] === socket.id)) {
				delete loggedUsers[userId];
				return;
			}
		}
	});

	socket.on('acceptRespond', function (jeste) {
		console.log('Accept Respond');
		jesteService.update(jeste)
			.then(_ => {
				let notification = {
					userId: new ObjectId(jeste.res_user_id),
					friendId: new ObjectId(jeste.req_user_id),
					jesteId: new ObjectId(jeste._id),
					img: jeste.img.secure_url,
					txt: `Someone accepted your offer to help!`,
					timestamp: Date.now(),
					isRead: false,
				}
				notificationService.add(notification)
					.then(result => {
						let socketId = loggedUsers[jeste.res_user_id];
						if (socketId) {
							notification._id = result.insertedId;
							io.to(`${socketId}`).emit('receivedNotification', notification);
						}
					})
			});
	});

	socket.on('rejectRespond', function (jeste) {
		let resUserId = jeste.res_user_id;
		console.log('Reject Respond');
		jeste.res_user_id = null;
		jesteService.update(jeste)
			.then(_ => {
				let notification = {
					userId: new ObjectId(resUserId),
					friendId: new ObjectId(jeste.req_user_id),
					jesteId: new ObjectId(jeste._id),
					img: jeste.img.secure_url,
					txt: `Someone rejected your offer to help!`,
					timestamp: Date.now(),
					isRead: false,
				}
				notificationService.add(notification)
					.then(result => {
						let socketId = loggedUsers[resUserId];
						if (socketId) {
							notification._id = result.insertedId;
							io.to(`${socketId}`).emit('receivedNotification', notification);
						}
					})
			});
	});

}

module.exports = {
	socket
};
