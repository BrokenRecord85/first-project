const db = require("../db/connection")



exports.provideCategories = () => {
    return db.query("SELECT * FROM categories").then((result) => {
        return result.rows;
      });
}

exports.provideReviewsById = (review_id) => {
  return db.query('SELECT * FROM reviews WHERE review_id=$1', [review_id]).then((result) => {
    return result.rows[0]
  })

}