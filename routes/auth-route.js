const userService = require('../services/user-service');

module.exports = (app) => {

	app.put(`/login`, (req, res) => {

		const loggingUser = req.body.user;
		console.log('before logged',loggingUser);
		
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

	app.put(`/logout`, (req, res) => {
		console.log('Session: \n', req.session);
		delete req.session.user
		console.log('Logged Out', req.session.user);
		res.sendStatus(200)
		// return Promise.resolve('logged out');
	})

	app.post(`/signup`, async (req, res) => {
		const nickname = req.body.nickname
		const user = await userService.addUser({ nickname })
		res.json(user)
	})
	app.put('/checklogin', (req, res) => {
		console.log('checklogin', req.session.user)
		
		if (req.session.user) return res.json(req.session.user)
		else res.status(401).send('not logged in')

	})

}