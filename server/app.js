if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const index = require('./routes/index');
const CommentController = require('./controllers/Comment')
const server = require('http').createServer(app);

app.use(cors())
const io = require("socket.io")(server, {
  // cors: { origin: process.env.CLIENT_URL_SOCKET },
  // cors: { origin: "http://localhost:3000/"
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id)

  socket.on("handler-comment", async (data) => {
    await CommentController.createComment(data.UserId, data.ProjectId, data.comment)
    io.emit("handler-comment/response");
    });

  socket.on("fetch-comment", async (ProjectId, limit) => {
    const comment = await CommentController.readComment(ProjectId, limit)
    io.emit("fetch-comment/response", comment);
    });

})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(index);
app.use(errorHandler)

module.exports = server