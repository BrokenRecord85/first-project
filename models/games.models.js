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

exports.selectCommentsById = (review_id) => {
  return db.query(`SELECT ARRAY_AGG(review_id) as existing_ids FROM reviews`)
  .then((result) => {
    if (!result.rows[0].existing_ids.includes(+review_id)) {
      return Promise.reject({status:404, msg:'Bad Request'})
    }
    

  })
  
  .then(() => {

    return db.query(`
    SELECT
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.review_id
    FROM comments
    LEFT JOIN reviews ON comments.review_id = reviews.review_id
    WHERE comments.review_id = $1`, [review_id])
  
  })
  .then((result) => {
    if(result.rows.length === 0) {
      return Promise.reject({status:200, msg:'This review has no comments yet'})
    }
    return result.rows
  })
}



exports.selectReviews = (sort_by='created_at', order = 'DESC', category) => {

  const validColumns = ['name', 'title', 'review_id', 'review_body', 'category', 'review_img_url', 'created_at', 'votes', 'designer', 'comment_count']
  const validOrder = ['DESC', 'ASC']
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({status: 400, msg: 'Bad request' })
  }
  if(!validOrder.includes(order.toUpperCase())) {
    return Promise.reject({status: 400, msg: 'Bad request' })
  }


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
  review_body,
  reviews.designer,
  COUNT(comments.review_id) ::INT AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id`

  console.log(category, '<<<<<<<<<<<<<<<<<<<<<<<<<<') 

  const groupString = ` GROUP BY reviews.review_id`

  let orderString = ` ORDER BY ${sort_by} ${order}`
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
      console.log(result.rows[0])
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

exports.createComment = ( newComment, ) => {
  const {author, body, review_id} = newComment
  
  return db.query(`SELECT username FROM users WHERE users.username=$1;`, [author])
  .then((result) => {
    if(result.rows.length === 0){
      return Promise.reject({status: 400, msg:'Username not found'})
    }
  })    
  .then(() => {
    return db.query(
       `SELECT reviews.review_id FROM reviews
       LEFT JOIN comments ON reviews.review_id = comments.review_id
       WHERE comments.review_id=$1;`, [review_id])
  })
  .then((result) => {
    console.log(result.rows[0])
    if (result.rows[0] === undefined) {
      return Promise.reject({ status: 404, msg: `Review  not found`})
    }
  })
  .then(() => {
    if (body.length === 0) {
      return Promise.reject({ status: 400, msg: 'Enter a comment'})
    }
  })
  
  .then(() => {
    return db
    .query(`INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING*;`, [body, author, review_id])
  })
  .then(({ rows }) => {
    return rows[0]
})

}

exports.removeComment = (comment_id) => {
  let comments = 0;
  return db.query(`SELECT comment_id FROM comments`)
  .then((result) => {
  comments = result.rows.length
  if (comment_id > comments) return Promise.reject({ status: 404, msg: `Comment not found`})      
  })
  
  .then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id=$1;`, [comment_id])
  .then(() => {
  })

  })
}






