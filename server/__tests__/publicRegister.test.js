const request = require('supertest')
const app = require('../app')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const transporter = require('../helpers/nodemailer');

const dateToday = new Date()

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

describe('POST /public/register - public register with API register', () => {
  test('POST /public/register - success', () => {
    jest.spyOn(transporter, 'sendMail').mockResolvedValue({ message: "Success" });
    return request(app)
      .post('/public/register')
      .send({
        fullname: 'Testing',
        username: 'testing',
        email: 'unregistered@mail.com',
        password: '1234567890',
      })
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'User Created');
      })
  });
  test('POST /public/register - Error : Fail to Send Email', () => {
    jest.spyOn(transporter, 'sendMail').mockRejectedValue({ name: "ISE" });
    return request(app)
      .post('/public/register')
      .send({
        fullname: 'Testing',
        username: 'testing',
        email: 'unregistered@mail.com',
        password: '1234567890',
      })
      .then(res => {
        expect(res.status).toBe(500)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'internal server error');
      })
  });
});