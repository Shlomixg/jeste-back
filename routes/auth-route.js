'use strict';

const userService = require('../services/user-service');

module.exports = app => {

    app.put(`/login`, (req, res) => {
        const loggingUser = req.body.user;
        userService.checkLogin(loggingUser)
            .then(user => {
                if (!user) throw 'No matching details found';
                req.session.user = user;
                console.log('Access Aprroved');
                res.json(user);
            })
            .catch(err => {
                console.log('Access Denied \n', err);
                return res.status(401).end('No user found');
            })
    });

    app.put(`/logout`, (req, res) => {
        delete req.session.user;
        console.log('Logged out');
        res.sendStatus(200);
    });

    app.post(`/signup`, async (req, res) => {
        const nickname = req.body.nickname;
        const user = await userService.addUser({ nickname });
        res.json(user);
    });

    app.put('/checklogin', (req, res) => {
        if (req.session.user) {
            userService.getUserById(req.session.user._id)
                .then(user => res.json(user));
        }
        else res.send('Not logged in');
    });

}