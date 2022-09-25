const request = require('supertest');
const db = require('../db/connection')
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const app = require('../app');
const { response } = require('../app');


beforeEach( () => seed(testData));
afterAll( ()=> db.end());


describe('GET wrong requests', () => {
    test('404: responds with page not found when wrong path given', () => {
        return request(app)
        .get('/api/absurd')
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg:'page not found'})

        })
    } )
})

describe('GET /api/categories', () => { 
    test('200: responds with an array of categories', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then( (response) => {
            expect(typeof response.body).toBe('object')
            expect(Array.isArray(response.body.categories)).toBe(true)
            expect(response.body.categories.length > 0).toBe(true)
            response.body.categories.forEach((category) => {
                expect(category).toHaveProperty('slug', expect.any(String))
                expect(category).toHaveProperty('description', expect.any(String))
                
            })
        })
    })
    
})

describe('GET /api/reviews/:review_id (comment_count)', () => {
    test('200: responds with a single review', () => {
      const review_id = 2;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.review.review_id).toBe(review_id)
          expect(body.review).toHaveProperty('title', expect.any(String))
          expect(body.review).toHaveProperty('designer', expect.any(String))
          expect(body.review).toHaveProperty('owner', expect.any(String))
          expect(body.review).toHaveProperty('review_img_url', expect.any(String))
          expect(body.review).toHaveProperty('review_body', expect.any(String))
          expect(body.review).toHaveProperty('category', expect.any(String))
          expect(body.review).toHaveProperty('created_at', expect.any(String))
          expect(body.review).toHaveProperty('votes', expect.any(Number))
        });
    });

    test('200: single review includes property comment_count', () => {
        const review_id = 2
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({body}) => {
            expect(body.review).toHaveProperty('comment_count', expect.any(String))
        })
    })
  
    test('400: bad request if invalid id format', () => {
        const review_id = 'banana'
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Bad request'})
        })
    })
    test('404: id not found', () => {
        const review_id = 2000
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Review not found'})
        })
    })
    
})

describe('GET /api/users', () => { 
    test('200: responds with an array of users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then( (response) => {
            expect(typeof response.body).toBe('object')
            expect(Array.isArray(response.body.users)).toBe(true)
            expect(response.body.users.length > 0).toBe(true)
            response.body.users.forEach((user) => {
                expect(user).toHaveProperty('username', expect.any(String))
                expect(user).toHaveProperty('name', expect.any(String))
                expect(user).toHaveProperty('avatar_url', expect.any(String))
                
            })
        })
    })
    
})


describe('PATCH /api/review/:reviewid', () => {
    test('200: responds with the updated review', () => {
      const newVotes = 5
      const reviewChanges = {
        inc_votes: newVotes
        
      }
        
      return request(app)
        .patch('/api/reviews/3')
        .send(reviewChanges)
        .expect(200)
        .then(({ body }) => {
          expect(body.review.votes).toEqual(10)
          expect(body.review.review_id).toEqual(3)
          expect(body.review).toEqual(
            expect.objectContaining({
                review_id: 3,
                title: 'Ultimate Werewolf',
                designer: 'Akihisa Okui',
                owner: 'bainesface',
                review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: "We couldn't find the werewolf!",
                category: 'social deduction',
                votes: 10
            })
          )
        });
    });

    test('400: bad request if invalid id format', () => {
        const review_id = 'banana'
        const newVotes = 5
        const reviewChanges = {
        inc_votes: newVotes
        
        }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(reviewChanges)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Bad request'})
        })
    })
    test('404: id not found', () => {
        const review_id = 2000
        const newVotes = 5
        const reviewChanges = {
        inc_votes: newVotes
        
        }
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(reviewChanges)
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Review not found'})
        })
    })
    test('400: returns bad request when body missing vote field', () => {
        const reviewChanges = {
            title: 'ME'
        }
        return request(app)
        .patch('/api/reviews/3')
        .send(reviewChanges)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Bad Request'})
        })
    })
    test('400: returns bad request when incorect data type given as votes value', () => {
        const reviewChanges = {
            inc_votes: 'banana'
        }
        return request(app)
        .patch('/api/reviews/3')
        .send(reviewChanges)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Enter a number'})
        })
    })
});

describe(' GET /api/reviews', () => {    
    test('200: responds with an array of reviews', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then( (response) => {
            expect(typeof response.body).toBe('object')
            expect(Array.isArray(response.body.reviews)).toBe(true)
            expect(response.body.reviews.length).toEqual(13)
            response.body.reviews.forEach((review) => {
                expect(review).toHaveProperty('owner', expect.any(String))
                expect(review).toHaveProperty('title', expect.any(String))
                expect(review).toHaveProperty('review_id', expect.any(Number))
                expect(review).toHaveProperty('category', expect.any(String))
                expect(review).toHaveProperty('review_img_url', expect.any(String))
                expect(review).toHaveProperty('created_at', expect.any(String))
                expect(review).toHaveProperty('votes', expect.any(Number))
                expect(review).toHaveProperty('designer', expect.any(String))
                expect(review).toHaveProperty('comment_count', expect.any(Number))         
            })
        })
    })    
    test('200: reviews are ordered in descending order', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then((response) => {
            expect(response.body.reviews).toBeSortedBy('created_at', {descending: true})
        })
    })    
    test('200: category exists but no games found', () => {
        return request(app)
        .get("/api/reviews?category=children's+games")
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual({msg:'No games in this category'})
        })
    })    
    test('200: reviews are filtered by category query', () => {
        return request(app)
        .get('/api/reviews?category=dexterity')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.reviews)).toBe(true)
            expect(response.body.reviews.length).toBe(1)
            expect(response.body.reviews[0]).toEqual(expect.objectContaining({
                title: 'Jenga',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Fiddly fun for all the family',
                category: 'dexterity',
                votes: 5
            }))
                
            
        })
    })    
    test('200: can handle multiple sort and filter requests', () => {
        return request(app)
        .get('/api/reviews?category=euro+game&sort_by=comment_count&order=asc')
        .expect(200)
        .then((response) => {
            expect(response.body.reviews.length).toBe(1)
            expect(Array.isArray(response.body.reviews)).toBe(true)
            expect(response.body.reviews[0]).toEqual(expect.objectContaining({
    
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                votes: 1,
                comment_count: 0
                    
            }))
             
             expect(response.body.reviews).toBeSortedBy('comment_count', {ascending: true
             })
        })
    })    
    test('200 :sorts reviews in ascending order if requested', () => {
        return request(app)
        .get('/api/reviews?order=asc')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.reviews)).toBe(true)
            expect(response.body.reviews.length).toBe(13)
            response.body.reviews.forEach((review) => {
                expect(review).toHaveProperty('owner', expect.any(String))
                expect(review).toHaveProperty('title', expect.any(String))
                expect(review).toHaveProperty('review_id', expect.any(Number))
                expect(review).toHaveProperty('category', expect.any(String))
                expect(review).toHaveProperty('review_img_url', expect.any(String))  
                expect(review).toHaveProperty('created_at', expect.any(String))
                expect(review).toHaveProperty('votes', expect.any(Number))
                expect(review).toHaveProperty('designer', expect.any(String))
                expect(review).toHaveProperty('comment_count', expect.any(Number))
            })
            expect(response.body.reviews).toBeSortedBy('created_at', {ascending: true})
            
        })
    })    
    test('404: category not found', () => {
        return request(app)
        .get('/api/reviews?category=banana')
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg:'Category not found'} )
        })
    })    
    test('400: returns enter category when empty string given', () => {
        return request(app)
        .get('/api/reviews?category=')
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Enter a category'})
        })
    })    
    test('400: invalid sort by query', () => {
        return request(app)
        .get('/api/reviews?sort_by=banana')
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Bad request'})
        })
    })    
    test('400: invalid order type', () => {
        return request(app)
        .get('/api/reviews?order=banana')
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Bad request'})
        })
    })
})    


describe('GET /api/reviews/:review_id/comments', () => {
    test('200: responds with an array of comments', () => {
        const review_id = 2
        return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(200)
        .then( (response) => {
            expect(typeof response.body).toBe('object')
            expect(Array.isArray(response.body.comments)).toBe(true)
            expect(response.body.comments.length).toEqual(3)
            response.body.comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('review_id', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.any(String))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('body', expect.any(String))         
            })
        })
    })
    test('404: id not found', () => {
        const review_id = 2000
        return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Bad Request'})
        })
    })
    test('200: review  exists but no comments found', () => {
        const review_id = 1
        return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual({msg:'This review has no comments yet'})
        })
    })
})

describe('POST /api/reviews/:review_id/comments', () => {
    test("201: adds a comment", () => {
      const review_id = 3
      const newComment = {
        author: 'mallionaire',
        body: 'Cool Cool',
        review_id: `${review_id}`,
      };
      return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(201)
        .then((response) => {
          expect(typeof response.body).toBe("object");
          expect(response.body.comments.body).toBe("Cool Cool")
          expect(response.body.comments.author).toBe('mallionaire')
          expect(response.body.comments).toHaveProperty("review_id",expect.any(Number));
          expect(response.body.comments).toHaveProperty("votes",expect.any(Number));
          expect(response.body.comments).toHaveProperty("created_at",expect.any(String))
        });
    });
    test('400: username not found', () => {
        const review_id = 2
        const newComment = {
            author: 'BlaBla',
            body: 'Cool Cool',
            review_id: `${review_id}`
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(400)
        .then(( response) => {
            expect(response.body).toEqual({msg: 'Username not found'})
        })
    })
    test('404: review not found', () => {
        const review_id = 200
        const newComment = {
            author: 'mallionaire',
            body: 'Cool Cool',
            review_id: `${review_id}`
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(404)
        .then(( response) => {
            expect(response.body).toEqual({msg: 'Review  not found'})
        })
    })
    test('400: invalid id format', () => {
        const review_id = 'banana'
        const newComment = {
            author: 'mallionaire',
            body: 'Cool Cool',
            review_id: `${review_id}`
        }
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(newComment)
        .expect(400)
        .then(( response) => {
            expect(response.body).toEqual({msg: 'Bad request'})
        })
    })
    test('400: empty comment body', () => {
        const REVIEW_ID = 2
        const newComment = {
            author: 'mallionaire',
            body: '',
            review_id: `${REVIEW_ID}`
            }
        return request(app)
        .post(`/api/reviews/${REVIEW_ID}/comments`)
        .send(newComment)
        .expect(400)
        .then(( response) => {
            expect(response.body).toEqual({msg: 'Enter a comment'})
        })
    })
})

describe("204: delete comment", () => {
    test("204: no content", () => {
        const comment_id = 2
        return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(204)
            .then((response) => {
            expect(typeof response.body).toBe("object");
            expect(Object.keys(response.body).length).toBe(0);
            });
    });
    test('404: comment does not exist', () => {
        const comment_id = 5432
        return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe(`Comment not found`)
        })
    })
    test('400: responds with error if user tries to delete a comment using an incorrect data type', () => {
        const comment_id= 'wallaby'
        return request(app)
        .delete(`/api/comments/${comment_id}`)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg:'Bad request'})
        })
    })
});