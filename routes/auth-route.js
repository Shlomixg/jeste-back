const userService = require('../services/user-service');

module.exports = (app) => {
    
    app.put(`/login`, (req, res) => {
        const nickname = req.body.nickname;
        userService.query({ nickname })
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

    app.post(`/signup`, (req, res) => {
        const nickname = req.body.nickname
        userService.addUser({ nickname })
            .then(user => res.json(user))
    })

}