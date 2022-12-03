const express = require('express');
const admin = express.Router();
const Admin = require('../controllers/Admin');
const authentication = require('../middleware/authentication');
const favorite = require('./favorite');
const report = require('./report');
const comment = require('./comment')

admin.post('/login', Admin.Login);
admin.use(authentication)
admin.get('/profile', Admin.getProfile);
admin.post('/register', Admin.Register);
admin.use('/favorites', favorite )
admin.use('/reports', report)
admin.use('/comments', comment)


module.exports = admin;