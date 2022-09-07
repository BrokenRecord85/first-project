const express = require("express");
const app = express();
const {getCategories, getReviewsById, getUsers, patchReview, getCommentCount} = require('./controllers/games.controllers')


app.use(express.json())

app.get('/api/categories', getCategories)

app.get('/api/reviews/:reviewid', getReviewsById)

app.get('/api/users', getUsers)

app.patch('/api/reviews/:reviewid', patchReview)


app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'page not found'})
})

app.use((err, req, res, next) => {
  console.log(err)
    if(err.code === '22P02') {
      res.status(400).send({msg: 'Bad request'})
    }
    if (err.status && err.msg) {    
      res.status(err.status).send({ msg: err.msg });
    } else {
      res.status(500).send({ msg: "Internal server error" });
    }
});


  
module.exports = app;

//'23502'