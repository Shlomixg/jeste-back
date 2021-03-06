'use strict';

const chatService = require('../services/chat-service');

const CHAT_URL = '/chat';

module.exports = app => {

	app.get(`${CHAT_URL}/:jesteId?`, (req, res) => {
		chatService.query(req.params.jesteId)
			.then(chatHistory => res.json(chatHistory));
	});

	app.post(`${CHAT_URL}`, (req, res) => {
		const { userId, thisUserId } = req.body;
		chatService.getHistory({ userId, thisUserId })
			.then(chatHistory => res.json(chatHistory))
	});

	app.put(`${CHAT_URL}`, (req, res) => {
		const { ids, userId, friendId } = req.body;
		console.log('User id', userId);
		console.log('Friend id', friendId);
		chatService.markRead(ids, userId, friendId)
			.then(_ => res.json())
	});

	app.put(`${CHAT_URL}/chat_list`, (req, res) => {
		const { userId } = req.body;
		chatService.getChatList(userId)
			.then(chatList => res.json(chatList))
	});

};
