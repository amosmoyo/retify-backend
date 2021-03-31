const express = require('express');

const userAuth = require('../controllers/users');

const router = express.Router();

console.log(userAuth.signup);

router.route('/signup').post(userAuth.signup);

router.route('/login').post(userAuth.login);

router.route('/forgotpassword').post(userAuth.passwordForget);

router.route('/resetpassword/:token').patch(userAuth.resetPassword);

module.exports = router;
