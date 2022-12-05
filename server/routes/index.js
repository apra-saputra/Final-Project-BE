const express = require('express');
const index = express.Router();
const admin = require('./admin');
const public = require('./public');
const cors = require('cors');


index.use(cors());
index.use('/admin', admin);
index.use('/public', public);

module.exports = index;