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
    return result.rows[0]
  })

}

exports.selectReviews = (category) => {

  let queryValues = []

  let finalQueryString = ''

  let queryString = 
  `SELECT 
  reviews.owner,
  reviews.title,
  reviews.review_id,
  reviews.category,
  reviews.review_img_url,
  reviews.created_at,
  reviews.votes,
  reviews.designer,
  COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id`

  const groupString = ` GROUP BY reviews.review_id`

  let orderString = ` ORDER BY created_at DESC`
  if(category === undefined) {
    finalQueryString += ` ${queryString} ${groupString} ${orderString}`
    return db.query(finalQueryString).then((result) => {
      return result.rows
    }) 
  }
  
  finalQueryString += ` ${queryString} WHERE reviews.category = $1 ${groupString}`
  queryValues.push(category)
  
  if (category === ''){
    return Promise.reject({status:400, msg: 'Enter a category'})
  } 
  
  return db.query(`SELECT ARRAY_AGG(slug) as game_categories FROM categories`)  
  .then((result => { 
    if (!result.rows[0].game_categories.includes(category)) {
    return Promise.reject({status:404, msg:'Category not found'})
    }
  }))
  .then(() => { 
  return db.query(finalQueryString, queryValues)
  })
  .then((result) => {
      if(result.rows.length === 0) {
        return Promise.reject({status:200, msg:'No games in this category'})
      }
      return result.rows
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




