const request = require('supertest')
const { server } = require('../app')
const { comparePassword } = require('../helpers/bcrypt')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize

beforeAll(() => {
  return queryInterface.bulkDelete('Users', null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
    .then(() => {
      return User.create({
        "username": "user",
        "fullname": "user fullname",
        "role": "Admin",
        "email": "user@mail.com",
        "password": "123456"
      })
    })
    .then(() => {
      return User.create({
        "username": "user",
        "fullname": "user fullname",
        "role": "User",
        "email": "user2@mail.com",
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
  test('POST /admin/login - success', () => {
    return request(server)
      .post('/admin/login')
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
  test('POST /admin/login - ERROR : fail with wrong password', () => {
    return request(server)
      .post('/admin/login')
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
  test('POST /admin/login - ERROR : fail with unregistered account', () => {
    return request(server)
      .post('/admin/login')
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
  test('POST /admin/login - ERROR : fail with empty password', () => {
    return request(server)
      .post('/admin/login')
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
  test('POST /admin/login - ERROR : fail with empty email', () => {
    return request(server)
      .post('/admin/login')
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
  test('POST /admin/login - ERROR : fail with empty email and password', () => {
    return request(server)
      .post('/admin/login')
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
  test('POST /admin/login - ERROR : fail unauthorized role', () => {
    return request(server)
      .post('/admin/login')
      .send({
        email: 'user2@mail.com',
        password: '123456',
      })
      .then(res => {
        expect(res.status).toBe(403);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'you are not authorized');
      })
  });
});