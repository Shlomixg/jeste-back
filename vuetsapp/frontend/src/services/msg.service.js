import moment from 'moment';
import ioClient from 'socket.io-client'

var socket = null;
const msgs = [];
var nickname = lorem();
var msgColor = randomColor();
var timeoutId = null;
connectSocket();

function connectSocket() {
    socket = ioClient('http://localhost:3000', { query: { nickname } });

    socket.on('user-connect', function (user) {
        markAsRead();
        msgs.push(createMsg(`${user} Joined`, 'Chatapp'));
    });
    socket.on('user-disconnect', function (user) {
        markAsRead();
        msgs.push(createMsg(`${user} left`, 'Chatapp'));
    });

    socket.on('chat history', function (historyMsgs) {
        msgs.push(...historyMsgs)
    });

    socket.on('chat newMsg', function (msg) {
        markAsRead();
        msgs.push(msg);
    });
}

function markAsRead() {
    if (msgs.length) msgs[msgs.length - 1].processed = true;
}

const getMsgs = () => {
    return msgs;
}

const send = (msg) => {
    // msgs.push(msg);
    socket.emit('chat send-message', msg);
}

function createEmptyMsg() {
    return createMsg('', nickname);
}

function createMsg(txt, sender) {
    return { txt, processed: false, from: sender, msgColor };
}



export default {
    getMsgs,
    send,
    nickname,
    createEmptyMsg,
}

function lorem(size = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < size; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}