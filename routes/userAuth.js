const express = require('express');

const userAuth = require('../controllers/users');

const userData = require('../controllers/userdata');

const router = express.Router();

console.log(userAuth.signup);

router.route('/signup').post(userAuth.signup);

router.route('/login').post(userAuth.login);

router.route('/forgotpassword').post(userAuth.passwordForget);

router.route('/resetpassword/:token').patch(userAuth.resetPassword);

router.route('/updatepassword').patch(userAuth.protectRoutes, userAuth.passwordUpdate);

router.route('/getallusers').get(userAuth.protectRoutes, userAuth.roles('admin'), userData.getAllUser);

router.route('/getoneuser').get(userAuth.protectRoutes, userData.getOneUser);

router.route('/updatemyrecord/:id').patch(userAuth.protectRoutes, userData.updatemydata);

router.route('/deleteaccount').delete(userAuth.protectRoutes, userData.deleteMyAccount);

module.exports = router;
