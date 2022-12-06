const express = require('express');
const router = express.Router();
const Admin = require('../controllers/Admin');
const Projects = require('../controllers/Projects');
const authentication = require('../middleware/authentication');

router.post('/login', Admin.Login);
router.use(authentication)
router.get('/profile', Admin.getProfile);
router.post('/register', Admin.Register);
router.get('/projects',Projects.Read)
router.patch('/projects/:id', Projects.SoftDelete)

module.exports = router;