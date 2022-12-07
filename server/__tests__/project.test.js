const request = require('supertest')
const app = require('../app')
const { sequelize, Project, Step } = require('../models')
const { queryInterface } = sequelize
const { encodeToken } = require('../helpers/jwt')
const imagekit = require('../helpers/imagekit');
const { hashPassword } = require('../helpers/bcrypt')
const multer = require('multer');

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

describe('POST /public/posts/project - Create Project', () => {
  test('POST /public/posts/project - Success', () => {
    jest.spyOn(imagekit, 'upload').mockResolvedValue({ fileId: "1234521", url: "URL" });
    return request(app)
      .post('/public/posts/project')
      .set('access_token', userToken)
      .field('title', 'test')
      .field('introduction', 'test')
      .field('difficulty', '1')
      .field('TagId', '1')
      .field('Names', 'test step 1')
      .field('Names', 'test step 2')
      .field('Description[0][0]', 'test desc 1')
      .field('Description[0][1]', 'test desc 2')
      .field('Description[1][0]', 'test desc 3')
      .field('Description[1][1]', 'test desc 4')
      .attach('mainImage', './test/Jacob Pascal Silaen.jpg')
      .attach('images', './test/Jacob Pascal Silaen.jpg')
      .attach('images', './test/Jacob Pascal Silaen.jpg')
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "Project has been created");
      })
  })
  test('POST /public/posts/project Error : Error from imagekit', () => {
    jest.spyOn(imagekit, 'upload').mockResolvedValueOnce({ fileId: "1234521", url: "URL" });
    jest.spyOn(imagekit, 'upload').mockRejectedValue({ name: "ISE" });
    return request(app)
      .post('/public/posts/project')
      .set('access_token', userToken)
      .field('title', 'test')
      .field('introduction', 'test')
      .field('difficulty', '1')
      .field('TagId', '1')
      .field('Names', 'test step 1')
      .field('Names', 'test step 2')
      .field('Description[0][0]', 'test desc 1')
      .field('Description[0][1]', 'test desc 2')
      .field('Description[1][0]', 'test desc 3')
      .field('Description[1][1]', 'test desc 4')
      .attach('mainImage', './test/Jacob Pascal Silaen.jpg')
      .attach('images', './test/Jacob Pascal Silaen.jpg')
      .attach('images', './test/Jacob Pascal Silaen.jpg')
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
  test('GET /public/projects - success', () => {
    return request(app)
      .get('/public/projects')
      .set('access_token', userToken)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('UserId', expect.any(Number));
        expect(res.body[0]).toHaveProperty('title', expect.any(String));
        expect(res.body[0]).toHaveProperty('slug', expect.any(String));
        expect(res.body[0]).toHaveProperty('imgUrl', expect.any(String));
        expect(res.body[0]).toHaveProperty('introduction', expect.any(String));
        expect(res.body[0]).toHaveProperty('difficulty', expect.any(String));
        expect(res.body[0]).toHaveProperty('TagId', expect.any(Number));
        expect(res.body[0]).toHaveProperty('status', 'Active');
      })
  });
  test('GET /public/projects/:id - success', () => {
    return request(app)
      .get('/public/projects/1')
      .set('access_token', userToken)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('UserId', expect.any(Number));
        expect(res.body).toHaveProperty('title', expect.any(String));
        expect(res.body).toHaveProperty('slug', expect.any(String));
        expect(res.body).toHaveProperty('imgUrl', expect.any(String));
        expect(res.body).toHaveProperty('introduction', expect.any(String));
        expect(res.body).toHaveProperty('difficulty', expect.any(String));
        expect(res.body).toHaveProperty('TagId', expect.any(Number));
        expect(res.body).toHaveProperty('status', 'Active');
      })
  });
  test('GET /public/projects - Error : Fail to Fetch', () => {
    jest.spyOn(Project, 'findAll').mockRejectedValue({ name: "ISE" });
    return request(app)
      .get('/public/projects')
      .set('access_token', userToken)
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  });
  test('GET /public/projects - Error : Fail to Fetch Detail', () => {
    return request(app)
      .get('/public/projects/99')
      .set('access_token', userToken)
      .then(res => {
        expect(res.status).toBe(404);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "project not found");
      })
  });
  test('PATCH /admin/projects/:id - Success', () => {
    return request(app)
      .patch('/admin/projects/1')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "status has been updated to");
      })
  })
  test('PATCH /admin/projects/:id - ERROR : ISE', () => {
    jest.spyOn(Project, 'update').mockRejectedValue({ name: "ISE" });
    return request(app)
      .patch('/admin/projects/1')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(500);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', "internal server error");
      })
  })
})
