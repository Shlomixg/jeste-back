const userService = require('../services/user-service');

module.exports = (app) => {

	app.put(`/login`, (req, res) => {

		const loggingUser = req.body.user;
		userService.checkLogin(loggingUser)
			.then(user => {
				req.session.user = user;
				console.log('Session: \n', req.session);
				console.log('Access Aprroved');
				res.json(user);
			})
			.catch(err => {
				console.log('Access Denied');
				return err;
			})
	})

	app.post(`/logout`, (req, res) => {
		console.log('Session: \n', req.session);
		req.session.user = null;
		console.log('Logged Out');
		res.sendStatus(200)
		// return Promise.resolve('logged out');
	})

	app.post(`/signup`, async (req, res) => {
		const nickname = req.body.nickname
		const user = await userService.addUser({ nickname })
		res.json(user)
	})
	app.put('/checklogin', (req, res) => {
		if (req.session.user) return res.json(req.session.user)
		else res.status(401).send('not logged in')

	})

}