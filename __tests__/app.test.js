const request = require('supertest');
const db = require('../db/connection')
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const app = require('../app');
const { response } = require('../app');


beforeEach( () => seed(testData));
afterAll( ()=> db.end());


describe('GET /api/categories', () => { 
    test('200: responds with an array of categories', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then( (response) => {
            console.log(response.body)
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