const jesteService = require('./jeste-service');
const getRoom = require('./room-service');
const userService = require('./user-service')
var loggedUsers = {};

function socket(socket,io) {
	var sokcetUserId;

	socket.on('userLogged',( {userId}) => {
		sokcetUserId = userId;
        loggedUsers[userId] = socket.id;
        console.log('user logged in socket',{userId});
        userService.query(userId).then(([user]) => {
            console.log({
                userDetails : user.details,
                id:  user._id,
                // res_jestes :  user.res_jestes
            }
            )
            return [...user.req_jestes, ...user.res_jestes].map(jeste => jeste._id)
        })
        .then(ids => {
            ids.forEach(id => socket.join(id))
        })
	});

	// socket.on('enterJesteRoom', ({reqUserId, jesteId}) => {
	// 	socket.join(jesteId);
	// 	io.to(jesteId).emit('userEntered', user);
	// });

	socket.on('sendMsg', ({ msg, jesteId}) => {
        // io.to(reqUserId).emit('userEntered', user);
        console.log('user', sokcetUserId, ' sent msg')
		socket.to(jesteId).emit('reciveMsg', { msg, user: sokcetUserId, jesteId });
	});

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
