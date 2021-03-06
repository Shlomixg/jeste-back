'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const socketService = require('./services/socket-service');

const PORT = process.env.PORT || 3000;
app.use(express.static('dist'));
var server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

var io = require('socket.io')(server);
io.on('connection', socket => socketService.socket(socket, io));

app.use(cors({
	origin: ['http://localhost:8080'],
	credentials: true // enable set cookie
}));

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
const addAuthRoutes = require('./routes/auth-route');
addAuthRoutes(app);
const addChatRoutes = require('./routes/chat-route');
addChatRoutes(app);
const addNotificationRoutes = require('./routes/notification-route');
addNotificationRoutes(app);

app.get('/', (req, res) => res.send('Hello Jeste'));