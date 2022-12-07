const request = require('supertest')
const { server: app } = require('../app')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize

beforeAll(() => {
  return queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
    .then(() => {
      // insert data for login testing
      return User.create({
        "username": "user",
        "fullname": "user fullname",
        "role": "User",
        "email": "user@mail.com",
        "password": "123456"
      })
    })
})

afterAll(() => {
  // remove all data or cleanup
  return queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
})

describe('POST /public/login - User Login with email and password', () => {
  test('POST /public/login - success', () => {
    return request(app)
      .post('/public/login')
      .send({
        email: 'user@mail.com',
        password: '123456',
      })
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('access_token', expect.any(String));
      })
  });
  test('POST /public/login - fail with wrong password', () => {
    return request(app)
      .post('/public/login')
      .send({
        email: 'user@mail.com',
        password: '123456780',
      })
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'error invalid email or password');
      })
  });
  test('POST /public/login - fail with unregistered account', () => {
    return request(app)
      .post('/public/login')
      .send({
        email: 'un_registered@mail.com',
        password: '123456789'
      })
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'error invalid email or password');
      })
  });
  test('POST /public/login - fail with empty password', () => {
    return request(app)
      .post('/public/login')
      .send({
        email: 'user@mail.com',
        password: '',
      })
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'error invalid email or password');
      })
  });
  test('POST /public/login - fail with empty email', () => {
    return request(app)
      .post('/public/login')
      .send({
        email: '',
        password: '123213',
      })
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'error invalid email or password');
      })
  });
  test('POST /public/login - fail with empty email and password', () => {
    return request(app)
      .post('/public/login')
      .send({
        email: '',
        password: '',
      })
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'error invalid email or password');
      })
  });

});