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

