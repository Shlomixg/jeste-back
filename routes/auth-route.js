const userService = require('../services/user-service');

module.exports = (app) => {

	app.put(`/login`, (req, res) => {
		const loggingUser = req.body.user;
		console.log('before logged', loggingUser);
		userService.checkLogin(loggingUser)
			.then(user => {
				if (!user) throw 'No match details found';
				req.session.user = user;
				console.log('Session: \n', req.session);
				console.log('Access Aprroved');
				res.json(user);
			})
			.catch(err => {
				console.log('Access Denied \n', err);
				return res.status(401).end('nouser found')
			})
	})

	app.put(`/logout`, (req, res) => {
		delete req.session.user;
		console.log('Logged out');
		res.sendStatus(200);
	})

	app.post(`/signup`, async (req, res) => {
		const nickname = req.body.nickname;
		const user = await userService.addUser({ nickname });
		res.json(user);
	})
	app.put('/checklogin', (req, res) => {
		console.log('Check Login:', req.session.user);
		if (req.session.user) return res.json(req.session.user);
		else res.send('not logged in');
	})

}