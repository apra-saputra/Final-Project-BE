if(process.env.MODE_ENV !== "production"){
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.use(errorHandler) //global error handler

module.exports = app