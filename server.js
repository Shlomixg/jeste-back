'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');

const app = express();

app.use(cors({
    origin: ['http://localhost:8080'],
    credentials: true // enable set cookie
}));
// Support JSON in the request's body (for our: POST/PUT requests)
app.use(bodyParser.json());

app.use(cookieParser());
// Configure the Session
app.use(session({
    name: 'app.sid',
    secret: '1234567890QWERTY',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Add Specific routes
const addUserRoutes = require('./routes/user-route');
addUserRoutes(app);
const addJesteRoutes = require('./routes/jeste-route');
addJesteRoutes(app);
// const addReviewRoutes = require('./routes/review-route')
// addReviewRoutes(app);
const addAuthRoutes = require('./routes/auth-route');
addAuthRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.get('/', (req, res) => res.send('Hello Jeste'));