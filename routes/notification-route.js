'use strict';

const notificationService = require('../services/notification-service');

const NOTIFICATION_URL = '/notification';

module.exports = app => {

    app.get(`${NOTIFICATION_URL}/:userId?`, (req, res) => {
        console.log('Notifications load', req.params);
        notificationService.query(req.params.userId)
            .then(notifications => res.json(notifications));
    });

    app.put(`${NOTIFICATION_URL}`, (req, res) => {
        const { ids } = req.body;
        notificationService.markRead(ids)
            .then(_ => res.json())
    });

};
