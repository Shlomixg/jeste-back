const jesteService = require('./jeste-service');
const userService = require('./user-service');
const chatSerivce = require('./chat-service');
var loggedUsers = {};

function socket(socket, io) {
	
	socket.on('userLogged', ({ userId }) => {
		loggedUsers[userId] = socket.id;
		userService.query(userId)
			.then(([user]) => {
				var ids = [...user.req_jestes, ...user.res_jestes].map(jeste => jeste._id);
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
		jesteService.update(jeste)
		.then(_ => socket.to(jesteId).emit('jesteResponded', jeste));
	});

	socket.on('sendMsg', ({ msg, jesteId }) => {
		chatSerivce.update({ msg, jesteId })
		msg.author = 'them';
		socket.to(jesteId).emit('receivedMsg', { msg });
	});

	socket.on('isTyping', ({ jesteId }) => {
		socket.to(jesteId).emit('isTyping');
	})

	socket.on('disconnect', function () {
		for (let userId in loggedUsers) {
			if ((loggedUsers[userId] = socket.id)) {
				delete loggedUsers[userId];
				return;
			}
		}
	});
}

module.exports = {
	socket
};
