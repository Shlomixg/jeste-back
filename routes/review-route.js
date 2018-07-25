const reviewService = require('../services/review-service');
const REVIEWS_URL = '/reviews';

module.exports = (app) => {
    app.get(REVIEWS_URL, (req, res) => {
        reviewService.query(req.query)
            .then(reviews => {
                res.json(reviews);
            })
    })

    app.post(REVIEWS_URL, (req, res) => {
        var review = {
            userId: req.session.user._id,
            // userId : req.body.userId,
            toyId: req.body.toyId,
            content: req.body.content
        }
        reviewService.addReview(review)
            .then(review => res.json(review))
    })
}