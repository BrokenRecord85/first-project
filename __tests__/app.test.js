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

describe('2. GET /api/reviews/:review_id', () => {
    test('status:200, responds with a single review', () => {
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