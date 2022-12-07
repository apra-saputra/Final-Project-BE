const request = require('supertest')
const { server: app } = require('../app')
const { sequelize, Comment } = require('../models')
const { queryInterface } = sequelize
const { hashPassword } = require('../helpers/bcrypt')
const { encodeToken } = require('../helpers/jwt')
const Client = require("socket.io-client");
const { Server } = require("socket.io");
const { createServer } = require("http");
const CommentController = require('../controllers/Comment')

const dateToday = new Date()
let adminToken = encodeToken({ id: 1, role: "Admin" })
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

describe("Socket", () => {
  let io, serverSocket, clientSocket;
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("Should accept message from client and input to DB", (done) => {
    clientSocket.emit("handler-comment", { UserId: 1, ProjectId: 1, comment: 'test' });
    serverSocket.on("handler-comment", (arg) => {
      const output = CommentController.createComment(arg.UserId, arg.ProjectId, arg.comment);
      expect(arg).toBeInstanceOf(Object);
      output.then(res => {
        expect(res).toBeInstanceOf(Object);
        expect(res).toHaveProperty("message", "Comment has been created")
      })
      done();
    });
  });

  test("Should view live message", (done) => {
    clientSocket.emit("fetch-comment", { ProjectId: "1", limit: "8" });
    serverSocket.on("fetch-comment", (arg) => {
      const comment = CommentController.readComment(arg.ProjectId, arg.limit);
      expect(arg).toBeInstanceOf(Object);
      comment.then(res => {
        expect(res).toBeInstanceOf(Object);
        expect(res).toHaveProperty("totalItems", expect.any(Number));
        expect(res).toHaveProperty("response", expect.any(Array));
        expect(res).toHaveProperty("limit", expect.any(Number));
      })
      done();
    });
  });
});

describe("Socket Fail", () => {
  let io, serverSocket, clientSocket;
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("Should Fail because no Project ID", (done) => {
    clientSocket.emit("handler-comment", { UserId: 1, comment: 'test' });
    serverSocket.on("handler-comment", (arg) => {
      const output = CommentController.createComment(arg.UserId, arg.ProjectId, arg.comment);
      expect(arg).toBeInstanceOf(Object);
      output.then(res => {
        expect(res).toBeInstanceOf(Object);
        expect(res).toHaveProperty("message", "project not found")
      })
      done();
    });
  });
});

describe('REST delete function', () => {
  test('Delete comment - Error : ISE', () => {
    jest.spyOn(Comment, 'destroy').mockRejectedValueOnce({ name: "ISE" });
    return request(app)
      .delete('/public/comment/1')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(500)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('message', 'internal server error');
      })
  })
  test('Delete comment - Err: Comment not Found', () => {
    return request(app)
      .delete('/public/comment/999')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.status).toBe(404)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("message", `comment not found`)
      })
  })
  test('Delete comment - Err: Not Authorized', () => {
    let userToken = encodeToken({ id: 2, role: 'User' })
    return request(app)
      .delete('/public/comment/1')
      .set('access_token', userToken)
      .then(res => {
        expect(res.status).toBe(403)
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("message", `you are not authorized`)
      })
  })
  test('Delete comment - Success', () => {
    return request(app)
      .delete('/public/comment/1')
      .set('access_token', adminToken)
      .then(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty("message", `Comment with has been deleted`)
      })
  })
})