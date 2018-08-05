const userService = require('../services/user-service');
const USERS_URL = '/user';

module.exports = app => {
	app.get(`${USERS_URL}/:id?`, (req, res) => {
		userService.query(req.params.id).then(users => res.json(users));
	});

	// app.delete(`${USERS_URL}/:userId`, (req, res) => {
	//     const userId = req.params.userId;
	//     userService.remove(userId)
	//         .then(() => res.end(`User ${userId} Deleted `))
	// })

	app.post(`${USERS_URL}`, (req, res) => {
	    const user = req.body;
	    userService.add(user)
	        .then(user => res.json(user))
	})

	// app.put(`${USERS_URL}/:userId`, (req, res) => {
	//     const user = req.body;
	//     userService.update(user)
	//         .then(user => res.json(user))
	// })
};
