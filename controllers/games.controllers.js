const { provideCategories,
        provideReviewsById, 
        selectUsers, 
        updateReviewById, 
        selectReviews, 
        selectCommentsById,
        createComment,
        removeComment,
        fetchUsers
    } = require("../models/games.models")



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
 
exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query
    console.log(category)
    selectReviews(sort_by, order, category).then((reviews) => {
       
        res.status(200).send({reviews})
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

exports.getCommentsById = (req, res, next) => {
    const review_id = req.params.reviewid
    selectCommentsById(review_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const newComment = req.body
    createComment(newComment).then((comments) => {
        res.status(201).send({comments})
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const comment_id = req.params.comment_id
    removeComment(comment_id).then(() => {
      res.status(204).send()
    })
    .catch(next)
}

exports.getUserById = (req, res, next) => {
    const username = req.params.username
    fetchUsers(username).then((users) => {
        console.log(users)
        if ( users !== undefined) {
            res.status(400).send({msg: 'Bad request'})
        }
        res.status(200).send({users})
    })
    .catch(next)
}
