const request = require('supertest')
const app = require('../app')
const { sequelize, Report } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { encodeToken } = require('../helpers/jwt')

const dateToday = new Date()
let validToken = encodeToken({ id: 1, role: 'User' })
let adminToken = encodeToken({ id: 2, role: 'Admin' })

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
      }, {
        "fullname": 'Testing',
        "username": 'testing',
        "email": 'registered2@mail.com',
        "role": "Admin",
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
    .then((result) => {
      return queryInterface.bulkInsert('Reports', [{
        "ProjectId": '1',
        "UserId": '1',
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
    .then((result) => {
      return queryInterface.bulkDelete('Reports', null, {
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

describe('GET /public/reports/:projectid - view reported project by ID : 1', () => {
  test('GET /public/reports/:projectid - success', () => {
    return request(app)
      .get('/public/reports/1')
      .set('access_token', validToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('reports', expect.any(Object));
        expect(res.body.reports).toBeInstanceOf(Object);
        expect(res.body.reports).toHaveProperty('ProjectId', expect.any(Number));
        expect(res.body.reports).toHaveProperty('UserId', expect.any(Number));
      })
  }),
    test('GET /public/reports/:projectid - ID Not Found', () => {
      return request(app)
        .get('/public/reports/99')
        .set('access_token', validToken)
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('message', expect.any(String));
        })
    })
})

describe('GET /public/reports - view all reported project', () => {
  test('GET /public/reports - Success', () => {
    return request(app)
      .get('/public/reports')
      .set('access_token', validToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('reports', expect.any(Object));
        expect(res.body.reports).toBeInstanceOf(Array);
      })
  })
  test('GET /public/reports - Error : ISE', () => {
    jest.spyOn(Report, 'findAll').mockRejectedValue({ name: "ISE" });
    return request(app)
      .get('/public/reports')
      .set('access_token', validToken)
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
})

describe('POST /public/reports/:projectid - Create Report', () => {
  test('POST /public/reports/2 - Success', () => {
    return request(app)
      .post('/public/reports/2')
      .set('access_token', validToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', expect.any(String));
      })
  })
  test('POST /public/reports/1 - Error: Duplicate report', () => {
    return request(app)
      .post('/public/reports/1')
      .set('access_token', validToken)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "project already on your report");
      })
  })
  test('GET /public/reports - Error : ISE', () => {
    jest.spyOn(Report, 'findAll').mockRejectedValue({ name: "ISE" });
    return request(app)
      .get('/public/reports')
      .set('access_token', validToken)
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
})

describe('DELETE /public/reports/:projectid - Delete Report', () => {
  test('DELETE /public/reports/1 - Success', () => {
    return request(app)
      .delete('/public/reports/1')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', expect.any(String));
      })
  })
  test('DELETE /public/reports/1 - Error: Report not found', () => {
    return request(app)
      .delete('/public/reports/1')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "report not found");
      })
  })
  test('DELETE /public/reports/2 - Error : ISE', () => {
    jest.spyOn(Report, 'destroy').mockRejectedValue({ name: "ISE" });
    return request(app)
      .delete('/public/reports/2')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
})