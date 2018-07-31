'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
const PORT = process.env.PORT || 3000;
var getRoom = require('./room-service');


var server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.emit('elad', 'bla bla bla')
    socket.on('pingServer', x => {
        console.log('in the ping server')
	})
	var userRoom;
	var user;
	socket.on('roomRequested', data => {
		currUser = data.user;
		reqUserId = data.req_user_id
		// socket.join(userRoom.id);
		// // io.to - send to everyone in the room (include the sender)
		// io.to(userRoom.id).emit('userConnected', user);
		console.log('this is data',data);
		
	});
});

app.use(
	cors({
		origin: ['http://localhost:8080'],
		credentials: true // enable set cookie
	})
);
// Support JSON in the request's body (for our: POST/PUT requests)
app.use(bodyParser.json());

app.use(cookieParser());
// Configure the Session
app.use(
	session({
		name: 'app.sid',
		secret: '1234567890QWERTY',
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false, maxAge: 8.64e7 * 3 }
	})
);

// Add Specific routes
const addUserRoutes = require('./routes/user-route');
addUserRoutes(app);
const addJesteRoutes = require('./routes/jeste-route');
addJesteRoutes(app);
// const addReviewRoutes = require('./routes/review-route')
// addReviewRoutes(app);
const addAuthRoutes = require('./routes/auth-route');
addAuthRoutes(app);


app.get('/', (req, res) => res.send('Hello Jeste'));
