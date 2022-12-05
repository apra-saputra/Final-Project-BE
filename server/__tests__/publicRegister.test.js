const request = require('supertest')
const app = require('../app')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')

const dateToday = new Date()

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
        "role": "User",
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

describe('POST /public/register - admin register with API register', () => {
  test('POST /public/register - success', () => {
    return request(app)
      .post('/public/register')
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
      })
  });
});