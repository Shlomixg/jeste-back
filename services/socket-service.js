const jesteService = require('./jeste-service');
const getRoom = require('./room-service');
var loggedUsers = {}

function socket(socket) {
    console.log('a user connected', socket.id);
	socket.on('userLogged', data => {
		loggedUsers[data.userId] = socket.id
		console.log(loggedUsers);
	});
	var userRoom
	var currUser;
	var reqUserId
	socket.on('roomRequested', data => {
		currUser = data.user;
		reqUserId = data.req_user_id
		userRoom = getRoom(currUser._id, reqUserId)
		socket.join(userRoom.id);
	});
	socket.on('messageSent', data => {
		console.log('sending to',loggedUsers[data.to]);
		
		
		io.to(`${loggedUsers[data.to]}`).emit('gotMsg', data);

		// io.to(userRoom).emit('msgReceived', data);


	})
	socket.on('respondJeste', data => {
        console.log('responded', data);
        data.jeste.status = 1;
        data.jeste.res_user_id = data.resUserId;
        jesteService.update(jeste)
            .then(jeste => {
                data.jeste = jeste;
                io.to(`${loggedUsers[data.jeste.req_user_id]}`).emit('gotResponse', data);
            })
		// io.to(userRoom).emit('msgReceived', data);


	})

	socket.on('disconnect', function () {
		for (let userId in loggedUsers) {
			if (loggedUsers[userId] = socket.id) {
				delete loggedUsers[userId]
				console.log(loggedUsers);
				
				return
			}
		}		
	  });
}
module.exports = {
    socket
}