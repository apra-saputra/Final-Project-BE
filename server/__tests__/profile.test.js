const request = require('supertest')
const { server: app } = require('../app')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { encodeToken } = require('../helpers/jwt')
const jwt = require('jsonwebtoken')

const dateToday = new Date()
let adminToken = encodeToken({ id: 1, role: 'Admin' })
let userToken = encodeToken({ id: 2, role: 'User' })
let inValidToken = '123455cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjY3NTQ3ODg5fQ.RtrucOpSAthM1qxqo6MLXb2eI3_r8w6u_-KZ9CXoJ5'

beforeAll(() => {
  return queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
    .then((result) => {
      return queryInterface.bulkInsert('Users', [{
        "fullname": 'Testing',
        "username": 'testing',
        "email": 'registered@mail.com',
        "role": "Admin",
        "password": hashPassword('123123123'),
        "createdAt": dateToday,
        "updatedAt": dateToday
      }, {
        "fullname": 'Testing',
        "username": 'testing',
        "email": 'registered2@mail.com',
        "role": "User",
        "password": hashPassword('123123123'),
        "createdAt": dateToday,
        "updatedAt": dateToday
      }], {})
    })
})

beforeEach(() => {
  jest.restoreAllMocks();
})

afterAll(() => {
  return queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
})

describe('GET /admin/profile - Profile admin', () => {
  test('GET /admin/profile - success', () => {
    return request(app)
      .get('/admin/profile')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('email', expect.any(String));
        expect(res.body).toHaveProperty('fullname', expect.any(String));
        expect(res.body).toHaveProperty('id', expect.any(Number));
        expect(res.body).toHaveProperty('role', "Admin");
        expect(res.body).toHaveProperty('username', expect.any(String));
      })
  });
  test('GET /admin/profile - Error : Auth Fail', () => {
    return request(app)
      .get('/admin/profile')
      .set('access_token', inValidToken)
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'error authentication - invalid token');
      })
  })

  test('GET /admin/profile - Error : Auth Fail No Token', () => {
    return request(app)
      .get('/admin/profile')
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'error authentication - invalid token');
      })
  })

  test('GET /admin/profile - Error : Auth Fail No User', () => {
    let userFail = encodeToken({ id: 99, role: 'Admin' })
    return request(app)
      .get('/admin/profile')
      .set('access_token', userFail)
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'error authentication - invalid token');
      })
  })

  test('GET /admin/profile - Error : ISE', () => {
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce({ id: "1", role: "Admin" });
    jest.spyOn(User, 'findByPk').mockRejectedValue({ name: "ISE" });
    return request(app)
      .get('/admin/profile')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('message', 'internal server error');
      })
  })
});

describe('GET /public/profile - Profile public', () => {
  test('GET /public/profile - success', () => {
    return request(app)
      .get('/public/profile')
      .set('access_token', userToken)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('email', expect.any(String));
        expect(res.body).toHaveProperty('fullname', expect.any(String));
        expect(res.body).toHaveProperty('id', expect.any(Number));
        expect(res.body).toHaveProperty('role', "User");
        expect(res.body).toHaveProperty('username', expect.any(String));
      })
  });
  test('GET /public/profile - Error : Auth Fail', () => {
    return request(app)
      .get('/public/profile')
      .set('access_token', inValidToken)
      .then(res => {
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'error authentication - invalid token');
      })
  })
  test('GET /public/profile - Error : ISE', () => {
    jest.spyOn(User, 'findByPk').mockResolvedValueOnce({ id: "2", role: "User" });
    jest.spyOn(User, 'findByPk').mockRejectedValue({ name: "ISE" });
    return request(app)
      .get('/public/profile')
      .set('access_token', userToken)
      .then(res => {
        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('message', 'internal server error');
      })
  })
});