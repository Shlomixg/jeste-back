const jesteService = require('./jeste-service');
const chatSerivce = require('./chat-service');
const notificationService = require('./notification-service');
var loggedUsers = {};
const ObjectId = require('mongodb').ObjectId;


function socket(socket, io) {
	socket.on('userLogged', ({ userId }) => {
		console.log('logged', userId);
		console.log(loggedUsers);
		
		
		loggedUsers[userId] = socket.id;
		console.log('loggged user after assign',loggedUsers);

	});

	socket.on('jesteResponded', ({ jeste, user }) => {
		let jesteId = jeste._id;
		socket.join(jesteId);
		delete jeste.req_user;
		delete jeste.res_user;
		jesteService
			.update(jeste)
			.then(_ => {
				let notification = {
					userId: new ObjectId(jeste.req_user_id),
					friendId: new ObjectId(user._id),
					jesteId: new ObjectId(jeste._id),
					img: jeste.img.secure_url,
					txt: `${user.details.firstName} ${user.details.lastName} just responded your Jeste!`,
					timestamp: Date.now(),
					isRead: false
				}
				notificationService.add(notification)
				.then(result => {
					let socketId = loggedUsers[jeste.req_user_id];

					if (socketId){
						notification._id = result.insertedId

						io.to(`${socketId}`).emit('receivedNotification', notification);


					}



				})


			});
	});

	socket.on('sendMsg', msg => {
		chatSerivce.add(msg).then(result => {
			chatSerivce.updateChatList(msg)
			
			
			

			if (loggedUsers[msg.toUserId]) {
				console.log('after');
				
				console.log('emit sent');
				msg._id = result.insertedId;
				let socketId = loggedUsers[msg.toUserId];
				io.to(`${socketId}`).emit('receivedMsg', msg);
			}
		})
		.catch(err => console.log('error occured', err))
	});

	socket.on('isTyping', ({ fromUserId, toUserId }) => {
		if (loggedUsers[toUserId]){

			io.to(`${loggedUsers[toUserId]}`).emit('isTyping', { fromUserId, toUserId });

		}
	});

	socket.on('logOut', function() {
		for (let userId in loggedUsers) {
			if ((loggedUsers[userId] = socket.id)) {
				delete loggedUsers[userId];
				return;
			}
		}
	});
	socket.on('disconnect', function() {
		console.log('disconnected');
		
		for (let userId in loggedUsers) {
			if ((loggedUsers[userId] === socket.id)) {
				delete loggedUsers[userId];
				return;
			}
		}
	});
}

module.exports = {
	socket
};
