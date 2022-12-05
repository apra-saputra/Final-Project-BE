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

describe('POST /admin/register - admin register with API register', () => {
  test('POST /admin/register - success', () => {
    return request(app)
      .post('/admin/register')
      .set('access_token', validToken)
      .send({
        fullname: 'Testing',
        username: 'testing',
        email: 'unregistered@mail.com',
        password: '1234567890',
      })
      .then(res=>{
        expect(res.status).toBe(201)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'User Created');
        expect(res.body).toHaveProperty('admin', expect.any(Object));
      })
  });
});

describe('POST /admin/register - FAIL admin register with API register', () => {
  test('POST /admin/register - fail with invalid token', () => {
    return request(app)
      .post('/admin/register')
      .set('access_token', inValidToken)
      .send({
        fullname: 'Testing',
        username: 'testing',
        email: 'unregistered2@mail.com',
        password: '1234567890',
      })
      .then(res=>{
        expect(res.status).toBe(401)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'error authentication - invalid token');
      })
  });
});

describe('POST /admin/register - FAIL admin register with API register', () => {
  test('POST /admin/register - fail incorrect email', () => {
    return request(app)
      .post('/admin/register')
      .set('access_token', validToken)
      .send({
        fullname: 'Testing',
        username: 'testing',
        email: 'registered',
        password: '1234567890',
      })
      .then(res=>{
        expect(res.status).toBe(400)
        expect(res.body).toBeInstanceOf(Object);
        // expect(res.body).toHaveProperty('message', 'Incorrect email format');
      })
  });
});