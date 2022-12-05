const request = require('supertest')
const app = require('../app')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { encodeToken } = require('../helpers/jwt')

const dateToday = new Date()
let validToken = encodeToken({ id : 1, role: 'Admin' })
let inValidToken = '123455cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjY3NTQ3ODg5fQ.RtrucOpSAthM1qxqo6MLXb2eI3_r8w6u_-KZ9CXoJ5'

beforeAll(()=>{
  return queryInterface.bulkDelete('Users', null, {
    truncate: true, 
    cascade:true,
    restartIdentity:true
  })
    .then((result)=>{
      return queryInterface.bulkInsert('Users', [{
        "fullname": 'Testing',
        "username": 'testing',
        "email": 'registered@mail.com',
        "role": "Admin",
        "password": hashPassword('123123123'),
        "createdAt": dateToday,
        "updatedAt": dateToday
      }], {})
    })
  })

afterAll(()=>{
  return queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade:true,
    restartIdentity:true
  })
})

describe('GET /admin/profile - Profile admin', () => {
  test('GET /admin/profile - success', () => {
    return request(app)
      .get('/admin/profile')
      .set('access_token', validToken)
      .then(res=>{
        expect(res.status).toBe(200)
        // expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('user', expect.any(Object));
      })
  });
  test('GET /admin/profile - fail', () => {
    return request(app)
      .get('/admin/profile')
      .set('access_token', inValidToken)
      .then(res=>{
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'error authentication - invalid token');
      })
  });
});