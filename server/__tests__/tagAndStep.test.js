const request = require('supertest')
const app = require('../app')
const { sequelize, Project, Step, Tag } = require('../models')
const { queryInterface } = sequelize
const { encodeToken } = require('../helpers/jwt')
const imagekit = require('../helpers/imagekit');
const { hashPassword } = require('../helpers/bcrypt')

const dateToday = new Date()
let userToken = encodeToken({ id: 1, role: 'User' });
let adminToken = encodeToken({ id: 2, role: 'Admin' });

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
      return queryInterface.bulkInsert('Steps', [{
        "ProjectId": "1",
        "name": "Step 1",
        "description": ['a', 'b', 'c'],
        "imgUrl": 'test',
        "createdAt": dateToday,
        "updatedAt": dateToday
      }, {
        "ProjectId": "1",
        "name": "Step 2",
        "description": ['d', 'e', 'f'],
        "imgUrl": 'test',
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
      return queryInterface.bulkDelete('Steps', null, {
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

describe('PUT /public/:projectid/:stepid - Create Project', () => {
  test('PUT /public/:projectid/:stepid - Success', () => {
    jest.spyOn(imagekit, 'upload').mockResolvedValue({ fileId: "1234521", url: "URL" });
    return request(app)
      .put('/public/posts/project/1/1')
      .set('access_token', userToken)
      .field('Names', 'test')
      .field('Description[0]', 'test desc 1')
      .field('Description[1]', 'test desc 3')
      .attach('image', './test/Jacob Pascal Silaen.jpg')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "Step has been updated");
      })
  })
  test('PUT /public/:projectid/:stepid - Error : ImageKit', () => {
    jest.spyOn(imagekit, 'upload').mockRejectedValue({ name: "ISE" });
    return request(app)
      .put('/public/posts/project/1/1')
      .set('access_token', userToken)
      .field('Names', 'test')
      .field('Description[0]', 'test desc 1')
      .field('Description[1]', 'test desc 3')
      .attach('image', './test/Jacob Pascal Silaen.jpg')
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
  test('PUT /public/:projectid/:stepid - Error : Sequelize', () => {
    jest.spyOn(imagekit, 'upload').mockResolvedValue({ fileId: "1234521", url: "URL" });
    jest.spyOn(Step, 'update').mockRejectedValue({ name: "ISE" });
    jest.spyOn(imagekit, 'deleteFile').mockResolvedValueOnce({ success: "success" });
    return request(app)
      .put('/public/posts/project/1/1')
      .set('access_token', userToken)
      .field('Names', 'test')
      .field('Description[0]', 'test desc 1')
      .field('Description[1]', 'test desc 3')
      .attach('image', './test/Jacob Pascal Silaen.jpg')
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
})

describe('GET /public/tags - FETCH TAGS', () => {
  test('GET /public/tags - Success', () => {
    return request(app)
      .get('/public/tags')
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toBeInstanceOf(Object);
        expect(res.body[0]).toHaveProperty('name', expect.any(String));
      })
  })
  test('GET /public/tags - ERROR : ISE', () => {
    jest.spyOn(Tag, 'findAll').mockRejectedValue({ name: "ISE" });
    return request(app)
      .get('/public/tags')
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
})
