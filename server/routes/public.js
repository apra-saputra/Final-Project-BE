const express = require('express');
const public = express.Router();
const Users = require('../controllers/User');
const authentication = require('../middleware/authentication');
const favorite = require('./favorite')
const report = require('./report')
const comment = require('./comment')

public.post('/login', Users.Login);
public.post('/register', Users.Register);
public.use(authentication)
public.get('/profile', Users.getProfile);
public.use('/favorites', favorite)
public.use('/reports', report)
public.use('/comments', comment)

module.exports = public;