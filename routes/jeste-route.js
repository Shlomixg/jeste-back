const jesteService = require('../services/jeste-service');
const JESTES_URL = '/jeste';

module.exports = (app) => {
    app.get(`${JESTES_URL}`, (req, res) => {
        var coordinates
        var q;

        if (!req.query || !req.query.coords) coordinates = [32.0853, 34.7818]
        else coordinates = req.query.coords.split(',').map(coord => +coord)
        if (!req.query || !req.query.q)  q = ''
        else q = new RegExp(req.query.q, 'igm')
        console.log(q);
        
        const criteria = [
            {
                $geoNear: {
                    near: { type: "Point", coordinates },
                    distanceField: "destination_loc.calculated",
                    maxDistance: 0,

                    maxDistance: 10000000000000000,
                    includeLocs: "destination_loc",
            
                    spherical: true
                }
            },
            {
                $match: {
                    keywords: {
                        $elemMatch: {
                            // $eq: "ood"
                            $regex: q
                        }
                    }
                }
            },

            {
                $lookup:
                {
                    from: 'user',
                    localField: 'req_user_id',
                    foreignField: '_id',
                    as: 'req_user'
                }
            },
            {
                $unwind: '$req_user'
            },
            {
                $lookup:
                {
                    from: 'user',
                    localField: 'res_user_id',
                    foreignField: '_id',
                    as: 'res_user'
                }
            },
            {
                $unwind: { path: '$res_user', preserveNullAndEmptyArrays: true }

            },

        ]
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