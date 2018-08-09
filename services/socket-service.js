const jesteService = require('./jeste-service');
const userService = require('./user-service');
const chatSerivce = require('./chat-service');
var loggedUsers = {};

function socket(socket, io) {
	socket.on('userLogged', ({ userId }) => {
		console.log('logged', userId);
		console.log(loggedUsers);
		
		
		loggedUsers[userId] = socket.id;
		console.log('loggged user after assign',loggedUsers);

		userService
			.query(userId)
			.then(([user]) => {
				var ids = [...user.req_jestes, ...user.res_jestes].map(
					jeste => jeste._id
				);
				return ids;
			})
			.then(ids => {
				ids.forEach(id => socket.join(id));
			});
	});

	socket.on('jesteResponded', ({ jeste }) => {
		let jesteId = jeste._id;
		socket.join(jesteId);
		delete jeste.req_user;
		delete jeste.res_user;
		jesteService
			.update(jeste)
			.then(_ => socket.to(jesteId).emit('jesteResponded', jeste));
	});

	socket.on('sendMsg', msg => {
		chatSerivce.add(msg).then(result => {
			console.log('before');
			console.log(msg.toUserId);
			console.log(loggedUsers[msg.toUserId]);
			console.log(loggedUsers);
			console.log('me', socket.id);
			chatSerivce.updateChatList(msg.fromUserId, msg.toUserId)
			
			
			

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
