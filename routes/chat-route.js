const chatService = require('../services/chat-service');
const CHAT_URL = '/chat';

module.exports = app => {
	app.get(`${CHAT_URL}/:jesteId?`, (req, res) => {
		chatService.query(req.params.jesteId).then(chatHistory => res.json(chatHistory));
	});

	// app.delete(`${USERS_URL}/:userId`, (req, res) => {
	//     const userId = req.params.userId;
	//     userService.remove(userId)
	//         .then(() => res.end(`User ${userId} Deleted `))
	// })

	app.post(`${CHAT_URL}`, (req, res) => {
	    const {userId, thisUserId} = req.body;
	    chatService.getHistory({userId, thisUserId} )
	        .then(chatHistory => res.json(chatHistory))
	})

	app.put(`${CHAT_URL}`, (req, res) => {
		const {ids, userId, friendId} = req.body
		console.log('user id', userId);
		console.log('friend id', friendId);
		
	    chatService.markRead(ids, userId, friendId)
	        .then(_ => res.json())
	})
	app.put(`${CHAT_URL}/chat_list`, (req, res) => {
		const {userId} = req.body

		
	    chatService.getChatList(userId)
	        .then(chatList => res.json(chatList))
	})

};
