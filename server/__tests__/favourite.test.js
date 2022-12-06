const request = require('supertest')
const app = require('../app')
const { sequelize, Favorite } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { encodeToken } = require('../helpers/jwt')

const dateToday = new Date()
let validToken = encodeToken({ id: 1, role: 'User' })

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
        "role": "User",
        "password": hashPassword('123123123'),
        "createdAt": dateToday,
        "updatedAt": dateToday
      }], {})
    })
    .then((result) => {
      return queryInterface.bulkInsert('Tags', [{
        "name": "Test",
        "createdAt": dateToday,
        "updatedAt": dateToday
      }])
    })
    .then((result) => {
      return queryInterface.bulkInsert('Projects', [{
        "UserId": '1',
        "title": "Test",
        "slug": "Test",
        "imgUrl": "Test",
        "introduction": "Test",
        "difficulty": "1",
        "TagId": "1",
        "status": "Active",
        "createdAt": dateToday,
        "updatedAt": dateToday
      }, {
        "UserId": '1',
        "title": "Test 1",
        "slug": "Test 1",
        "imgUrl": "Test 1",
        "introduction": "Test 1",
        "difficulty": "1",
        "TagId": "1",
        "status": "Active",
        "createdAt": dateToday,
        "updatedAt": dateToday
      }])
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
    .then((result) => {
      return queryInterface.bulkDelete('Favorites', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
      })
    })
    .then((result) => {
      return queryInterface.bulkDelete('Projects', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
      })
    })
    .then((result) => {
      return queryInterface.bulkDelete('Tags', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true
      })
    })
})

describe('POST /public/favorites/:projectid - create a favourite project', () => {
  test('POST /public/favorites/:projectid - Success', () => {
    return request(app)
      .post('/public/favorites/1')
      .set('access_token', validToken)
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', expect.any(String));
      })
  })
  test('POST /public/favorites - Error : Duplicate Favourite', () => {
    return request(app)
      .post('/public/favorites/1')
      .set('access_token', validToken)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "project already on your favorite");
      })
  })
})

describe('GET /public/favorites - view all favourited project', () => {
  test('GET /public/favorites - Success', () => {
    return request(app)
      .get('/public/favorites')
      .set('access_token', validToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('favourites', expect.any(Array));
      })
  })
  test('GET /public/favorites - Error : ISE', () => {
    jest.spyOn(Favorite, 'findAll').mockRejectedValue({ name: "ISE" });
    return request(app)
      .get('/public/favorites')
      .set('access_token', validToken)
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
})

describe('DELETE /public/favorites/:favid', () => {
  test('DELETE /public/favorites/:favid - Error : ISE', () => {
    jest.spyOn(Favorite, 'destroy').mockRejectedValue({ name: "ISE" });
    return request(app)
      .delete('/public/favorites/1')
      .set('access_token', validToken)
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
  test('DELETE /public/favorites/:favid - Success', () => {
    return request(app)
      .delete('/public/favorites/1')
      .set('access_token', validToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', expect.any(String));
      })
  })
  test('DELETE /public/favorites/:favid - Error : Favourite Not Found', () => {
    return request(app)
      .delete('/public/favorites/1')
      .set('access_token', validToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "project not found");
      })
  })

})