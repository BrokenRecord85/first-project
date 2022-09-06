const express = require("express");
const app = express();
const {getCategories, getReviewsById} = require('./controllers/games.controllers')


app.get('/api/categories', getCategories)

app.get('/api/reviews/:reviewid', getReviewsById)

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'page not found'})
})

app.use((err, req, res, next) => {
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