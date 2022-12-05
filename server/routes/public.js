const express = require('express');
const CommentController = require('../controllers/Comment');
const router = express.Router();
const Users = require('../controllers/User');
const authentication = require('../middleware/authentication');
const Authorization = require('../middleware/authorization');
const favorite = require('./favorite')
const report = require('./report')

router.post('/login', Users.Login);
router.post('/register', Users.Register);
router.use(authentication)
router.get('/profile', Users.getProfile);
router.use('/favorites', favorite)
router.use('/reports', report)
router.delete('/comment/:commentId', Authorization.deleteComment, CommentController.deleteComment)

module.exports = router;