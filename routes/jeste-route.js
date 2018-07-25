const jesteService = require('../services/jeste-service');
const JESTES_URL = '/jeste';

module.exports = (app) => {
    app.get(`${JESTES_URL}`, (req, res) => {
        const criteria = {};
        jesteService.query(criteria)
            .then(jestes => res.json(jestes))
    })

    app.get(`${JESTES_URL}/:jesteId`, (req, res) => {
        const jesteId = req.params.jesteId;
        jesteService.getById(jesteId)
            .then(jeste => res.json(jeste))
    })

    app.delete(`${JESTES_URL}/:jesteId`, (req, res) => {
        if (!req.session.user.isAdmin) return Promise.reject('No Permission');
        const jesteId = req.params.jesteId;
        jesteService.remove(jesteId)
            .then(() => res.end(`Jeste ${jesteId} Deleted `))
    })

    app.post(`${JESTES_URL}`, (req, res) => {
        if (!req.session.user.isAdmin) return Promise.reject('No Permission');
        const jeste = req.body;
        jeste.createdAt = Date.now();
        jesteService.add(jeste)
            .then(jeste => res.json(jeste))
    })

    app.put(`${JESTES_URL}/:jesteId`, (req, res) => {
        if (!req.session.user.isAdmin) return Promise.reject('No Permission');
        const jeste = req.body;
        jesteService.update(jeste)
            .then(jeste => res.json(jeste))
    })
}