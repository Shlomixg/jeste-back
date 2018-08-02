const jesteService = require('./jeste-service');
const getRoom = require('./room-service');
const userService = require('./user-service');
var loggedUsers = {};

function socket(socket, io) {
	var sokcetUserId;

	socket.on('userLogged', ({ userId }) => {
		sokcetUserId = userId;
		loggedUsers[userId] = socket.id;
		console.log('user logged in socket', { userId });
		userService
			.query(userId)
			.then(([user]) => {
				console.log({
					userDetails: user.details,
					id: user._id
					// res_jestes :  user.res_jestes
                });
                console.log('req', user.req_jestes);
                console.log('res', user.res_jestes);
                
				var ids = [...user.req_jestes, ...user.res_jestes].map(
					jeste => jeste._id
                );
                console.log('this is ids', ids);
                
                return ids
			})
			.then(ids => {
				ids.forEach(id => socket.join(id));
			});
	});

	// socket.on('enterJesteRoom', ({reqUserId, jesteId}) => {
	// 	socket.join(jesteId);
	// 	io.to(jesteId).emit('userEntered', user);
	// });
	socket.on('jesteResponded', ({jeste}) => {
        let jesteId = jeste._id;
        console.log('this is the id before', jesteId);

		socket.join(jesteId);
		delete jeste.req_user;
		delete jeste.res_user;
		console.log('JEST UT CLICKED', jeste);

		jesteService.update(jeste)
		.then(_ => {
            console.log('then socket');
            console.log('this is the id', jesteId);
            
            
			socket.to(jesteId).emit('reciveMsg', jeste);
		});
	});

	socket.on('sendMsg', ({ msg, jesteId }) => {
        console.log('MSG WAS SENT POPO',  io.sockets.adapter.rooms);

        
        msg.author = 'them'
		socket
			.to(jesteId)
			.emit('receivedMsg', { msg });
    });
    socket.on('isTyping' , ({jesteId}) => {
        console.log('someone is TYPING', jesteId);
        
        socket
        .to(jesteId)
        .emit('isTyping');
        

    })

	socket.on('disconnect', function() {
		for (let userId in loggedUsers) {
			if ((loggedUsers[userId] = socket.id)) {
				delete loggedUsers[userId];
				console.log(loggedUsers);

				return;
			}
		}
	});
}
module.exports = {
	socket
};
