const express = require('express');
const admin = express.Router();
const Admin = require('../controllers/Admin');
const authentication = require('../middleware/authentication');

admin.post('/login', Admin.Login);
admin.get('/profile', authentication, Admin.getProfile);
admin.post('/register', authentication, Admin.Register);

module.exports = admin;