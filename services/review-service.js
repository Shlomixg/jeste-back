'use strict';

const mongoService = require('./mongo-service');
const ObjectId = require('mongodb').ObjectId;
const dbCol = 'reviews';

function getById(reviewId) {
    const _id = new ObjectId(reviewId)
    return mongoService.connect()
        .then(db => {
            return db.collection(dbCol).aggregate([
                {
                    $match: { _id: _id }
                },
                {
                    $lookup:
                    {
                        from: 'jeste',
                        localField: 'jesteId',
                        foreignField: '_id',
                        as: 'jeste'
                    }
                },
                {
                    $unwind: '$jeste'
                },
                {
                    $lookup:
                    {
                        from: 'user',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                }
            ]).toArray()
                .then(reviews => reviews[0])
        })
}

function query({ userId = null, toyId = null } = {}) {
    const criteria = {}
    if (userId) criteria.userId = new ObjectId(userId)
    if (jesteId) criteria.toyId = new ObjectId(jesteId)
    return mongoService.connect().then(db => {
        return db.collection(dbCol)
            .aggregate([
                {
                    $match: criteria
                },
                {
                    $lookup:
                    {
                        from: 'jeste',
                        localField: 'jesteId',
                        foreignField: '_id',
                        as: 'jeste'
                    }
                },
                {
                    $unwind: '$jeste'
                },
                {
                    $lookup:
                    {
                        from: 'user',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                }
            ]).toArray()
    })
}

function getUserReviews(userId) {
    const id = new ObjectId(userId)
    return mongoService.connect()
        .then(db =>
            db.collection(dbCol).aggregate([
                {
                    $match: { userId: id }
                },
                {
                    $lookup:
                    {
                        from: 'jeste',
                        localField: 'jesteId',
                        foreignField: '_id',
                        as: 'jeste'
                    }
                }, {
                    $unwind: '$jeste'
                }
            ]).toArray()
        )
}

function addReview({ userId, toyId, content }) {
    var review = {
        userId: new ObjectId(userId),
        toyId: new ObjectId(toyId),
        content
    }
    return mongoService.connect()
        .then(db => db.collection(dbCol).insertOne(review))
        .then(res => {
            review._id = res.insertedId;
            return getById(res.insertedId);
        })
}

module.exports = {
    getById,
    query,
    getUserReviews,
    addReview
}