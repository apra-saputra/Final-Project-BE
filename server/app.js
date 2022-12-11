if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const index = require('./routes/index');
const server = require('http').createServer(app);

app.use(cors())
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:3001"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(index);
app.use(errorHandler)

module.exports = { server, io }