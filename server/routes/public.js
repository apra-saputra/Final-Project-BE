const express = require('express');
const public = express.Router();
const Users = require('../controllers/User');
const Projects = require('../controllers/Projects');
const authentication = require('../middleware/authentication');
const favorite = require('./favorite');
const report = require('./report');
const project = require('./project');

public.post('/login', Users.Login);
public.post('/register', Users.Register);
public.get('/projects', Projects.Read);
public.get('/projects/:id', Projects.ReadDetail);
public.use(authentication)
public.get('/profile', Users.getProfile);
public.use('/posts', project);
public.use('/favorites', favorite)
public.use('/reports', report)

module.exports = public;