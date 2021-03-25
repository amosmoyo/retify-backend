const express = require('express');

const userAuth = require('../controllers/users');

const router = express.Router();

router.post('/signup', userAuth.signup);

module.exports = router;
