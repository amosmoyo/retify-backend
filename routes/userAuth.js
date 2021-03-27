const express = require('express');

const userAuth = require('../controllers/users');

const router = express.Router();

console.log(userAuth.signup);

router.route('/signup').post(userAuth.signup);

router.route('/login').post(userAuth.login);

module.exports = router;
