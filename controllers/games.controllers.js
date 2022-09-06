const { provideCategories, provideReviewsById } = require("../models/games.models")



exports.getCategories =(req, res, next) => {
    provideCategories().then((categories) => {
        res.send({categories})
    })
    .catch(next)
}

exports.getReviewsById = (req, res, next) => {
    const review_id = req.params.reviewid
    provideReviewsById(review_id).then((review) => {
        if (review === undefined) {
            res.status(404).send({msg: 'Review not found'})
        }
        res.status(200).send({review})
    })
    .catch(next)
}