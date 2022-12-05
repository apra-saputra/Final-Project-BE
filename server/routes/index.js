const express = require('express');
const index = express.Router();
const adminRoute = require('./admin');
const publicRoute = require('./public');

index.use('/admin', adminRoute);
index.use('/public', publicRoute);

module.exports = index;