const { provideCategories } = require("../models/games.models")



exports.getCategories =(req, res, next) => {
    provideCategories().then((categories) => {
        res.send({categories})
    })
    .catch(next)
}