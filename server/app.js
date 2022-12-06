if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const index = require('./routes/index');

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(index);

app.use(errorHandler)

module.exports = app