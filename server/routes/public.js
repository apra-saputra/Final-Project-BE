const express = require('express');
const public = express.Router();
const Users = require('../controllers/User');
const authentication = require('../middleware/authentication');

public.post('/login', Users.Login);
public.post('/register', Users.Register);
public.get('/profile', authentication, Users.getProfile);

module.exports = public;