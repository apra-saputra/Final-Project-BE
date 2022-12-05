const express = require('express');
const CommentController = require('../controllers/Comment');
const public = express.Router();
const Users = require('../controllers/User');
const authentication = require('../middleware/authentication');
const Authorization = require('../middleware/authorization');
const favorite = require('./favorite')
const report = require('./report')

public.post('/login', Users.Login);
public.post('/register', Users.Register);
public.use(authentication)
public.get('/profile', Users.getProfile);
public.use('/favorites', favorite)
public.use('/reports', report)
public.delete('/comment/:commentId', Authorization.deleteComment, CommentController.deleteComment)

module.exports = public;