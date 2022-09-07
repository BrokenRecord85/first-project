const { provideCategories, provideReviewsById, selectUsers, updateReviewById} = require("../models/games.models")



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

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
}

exports.patchReview = (req, res, next) => {

    const newVotes = req.body.inc_votes
    const review_id = req.params.reviewid

    updateReviewById(review_id, newVotes).then((review) => {
        if (review === undefined) {
            res.status(404).send({msg: 'Review not found'})
        }
        res.status(200).send({review})
    })
    .catch(next)
}

exports.getCommentCount = () => {
    provideCommentCount()
}