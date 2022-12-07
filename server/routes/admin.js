const express = require('express');
const router = express.Router();
const Admin = require('../controllers/Admin');
const Projects = require('../controllers/Projects');
const authentication = require('../middleware/authentication');
const Authorization = require('../middleware/authorization');

router.post('/login', Admin.Login);
router.use(authentication)
router.get('/profile', Admin.getProfile);
router.post('/register', Admin.Register);
router.get('/projects', Projects.Read);
router.patch('/projects/:id', Authorization.deleteProject, Projects.SoftDelete);

module.exports = router;