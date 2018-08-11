'use strict'
const NOTIFICATION_URL = '/notification';
const notificationService = require('../services/notification-service');



module.exports = app => {
    app.get(`${NOTIFICATION_URL}/:userId?`, (req, res) => {
        console.log('notifications load', req.params);
        
        notificationService.query(req.params.userId).then(notifications => res.json(notifications));
    
    
    })
    app.put(`${NOTIFICATION_URL}`, (req, res) => {
		const {ids} = req.body
		
	    notificationService.markRead(ids)
	        .then(_ => res.json())
	})


};
