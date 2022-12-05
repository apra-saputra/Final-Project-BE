const express = require('express');
const router = express.Router();
const Admin = require('../controllers/Admin');
const authentication = require('../middleware/authentication');

router.post('/login', Admin.Login);
router.get('/profile', authentication, Admin.getProfile);
router.post('/register', authentication, Admin.Register);

module.exports = router;