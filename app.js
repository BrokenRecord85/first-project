const express = require("express");
const app = express();
const {getCategories} = require('./controllers/games.controllers')


app.get('/api/categories', getCategories)

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'page not found'})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      res.status(500).send({ msg: "Internal server error" });
    }
});


  
module.exports = app;