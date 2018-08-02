const chatService = require('../services/chat-service');
const CHAT_URL = '/chat';

module.exports = app => {
	app.get(`${CHAT_URL}/:jesteId?`, (req, res) => {
		console.log('test ');
		chatService.query(req.params.jesteId).then(chatHistory => res.json(chatHistory));
	});

	// app.delete(`${USERS_URL}/:userId`, (req, res) => {
	//     const userId = req.params.userId;
	//     userService.remove(userId)
	//         .then(() => res.end(`User ${userId} Deleted `))
	// })

	app.post(`${CHAT_URL}`, (req, res) => {
	    const msg = req.body;
	    chatService.add(msg)
	        .then(_ => res.end())
	})

	// app.put(`${USERS_URL}/:userId`, (req, res) => {
	//     const user = req.body;
	//     userService.update(user)
	//         .then(user => res.json(user))
	// })
};
