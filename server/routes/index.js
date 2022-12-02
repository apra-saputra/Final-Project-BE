const express = require('express');
const index = express.Router();
const admin = require('./admin');
const public = require('./public');

index.use('/admin', admin);
index.use('/public', public);

module.exports = index;