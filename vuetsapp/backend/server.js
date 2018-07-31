var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectedUsersCounter = 0;
var prevMsgs = [];

io.on('connection', function (socket) {
    connectedUsersCounter++;
    const user = socket.handshake.query.nickname;
    socket.broadcast.emit('user-connect', user);
    console.log('a user connected:', user);

    socket.on('disconnect', function () {
        connectedUsersCounter--;
        console.log('user disconnected:', user);
        socket.broadcast.emit('user-disconnect', user);
    });

    socket.on('chat send-message', function (msg) {
        // console.log('message: ' + msg.txt);
        if (prevMsgs.length === 10) prevMsgs.shift()
        prevMsgs.push(msg)
        io.emit('chat newMsg', msg);
        // io.emit('not-typing', msg.from);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});