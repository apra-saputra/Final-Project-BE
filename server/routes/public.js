const express = require('express');
const CommentController = require('../controllers/Comment');
const router = express.Router();
const Users = require('../controllers/User');
const Projects = require('../controllers/Projects');
const Tags = require('../controllers/Tag');
const authentication = require('../middleware/authentication');
const Authorization = require('../middleware/authorization');
const favorite = require('./favorite')
const project = require('./project');
const report = require('./report');

router.post('/login', Users.Login);
router.post('/register', Users.Register);
router.get('/projects', Projects.Read);
router.get('/tags', Tags.readTags);
router.get('/projects/:id', Projects.ReadDetail);
router.use(authentication)
router.get('/profile', Users.getProfile);
router.use('/favorites', favorite)
router.use('/reports', report)
router.use('/posts', project);
router.delete('/comment/:commentId', Authorization.deleteComment, CommentController.deleteComment)


module.exports = router;