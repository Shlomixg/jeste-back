const jesteService = require('../services/jeste-service');
const ObjectId = require('mongodb').ObjectId;
const JESTES_URL = '/jeste';

module.exports = app => {
	app.get(`${JESTES_URL}`, (req, res) => {
		console.log('--- ReqQuery: ---', req.query);
		let coordinates = req.query.coords.split(',').map(coord => +coord);
		let qText = new RegExp(req.query.q, 'igm');
		let maxDistance = +req.query.maxDistance;
		let price = +req.query.maxPrice;
		let category = req.query.category === 'All' ? '' : req.query.category;
		// price = 12
		const criteria = [
			{
				$geoNear: {
					near: { type: 'Point', coordinates },
					distanceField: 'destination_loc.calculated',
					minDistance: 0,
					maxDistance,
					spherical: true,
					query: {
						$and: [
							{
								$or: [
									{
										keywords: {
											$elemMatch: { $regex: qText }
										}
									},
									{
										description: { $regex: qText }
									},
									{
										title: { $regex: qText }
									}
								]
							},
							// Using ternary if to decide whether filter by category/price or not
							{ ...(category ? { category } : {}) },
							{ ...(price ? { price: { $lte: price } } : {}) }
						]
					}
				}
			},
			// { $sort : { created_at : 1} },
			{
				$lookup: {
					from: 'user',
					localField: 'req_user_id',
					foreignField: '_id',
					as: 'req_user'
				}
			},
			{
				$unwind: { path: '$req_user', preserveNullAndEmptyArrays: true }
			},
			{
				$lookup: {
					from: 'user',
					localField: 'res_user_id',
					foreignField: '_id',
					as: 'res_user'
				}
			},
			{
				$unwind: { path: '$res_user', preserveNullAndEmptyArrays: true }
			}
		];
		jesteService.query(criteria).then(jestes => res.json(jestes));
	});

	app.get(`${JESTES_URL}/:jesteId`, (req, res) => {
		const jesteId = req.params.jesteId;
		jesteService.getById(jesteId).then(jeste => res.json(jeste));
	});

	app.delete(`${JESTES_URL}/:jesteId`, (req, res) => {
		// if (!req.session.user.isAdmin) return Promise.reject('No Permission');
		const jesteId = req.params.jesteId;
		jesteService
			.remove(jesteId)
			.then(() => res.end(`Jeste ${jesteId} Deleted `));
	});

	app.post(`${JESTES_URL}`, (req, res) => {
		// if (!req.session.user.isAdmin) return Promise.reject('No Permission');
		const ObjectId = require('mongodb').ObjectId;
		const jeste = req.body;
		jeste.req_user_id = ObjectId(jeste.req_user_id);
		jeste.created_at = Date.now();
		jesteService.add(jeste).then(jeste => res.json(jeste));
	});

	app.put(`${JESTES_URL}/:jesteId`, (req, res) => {
		// if (!req.session.user.isAdmin) return Promise.reject('No Permission');
		const jeste = req.body;
		jeste.req_user_id = ObjectId(jeste.req_user_id);
		jesteService.update(jeste).then(jeste => res.json(jeste));
	});
};
