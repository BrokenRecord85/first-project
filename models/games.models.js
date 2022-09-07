const db = require("../db/connection")



exports.provideCategories = () => {
    return db.query("SELECT * FROM categories").then((result) => {
        return result.rows;
      });
}

exports.provideReviewsById = (review_id) => {
  return db.query(
    `SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, 
    COUNT(comments.review_id) AS comment_count
    FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id=$1
    GROUP BY reviews.review_id;`, [review_id]).then((result) => {
    console.log(result.rows[0])
    return result.rows[0]
  })

}

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
      return result.rows;
  });
}

exports.updateReviewById = (review_id, votes) => {
  if(votes === undefined) {
    return Promise.reject({status: 400, msg:'Bad Request'})
  }

  if (typeof votes !== 'number') {
    return Promise.reject({status: 400, msg:'Enter a number'})
  }
  return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING *;', [votes, review_id])
  .then((result) => {
      return result.rows[0]
  })
};


