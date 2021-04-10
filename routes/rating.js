const express = require('express');

const auThorization = require('../controllers/users');

const router = express.Router();

const getAllRating = (req, res, next) => {
  console.log(Math.max(...[1, 2, 49]));

  console.log(req, 'get all ratings');

  res.status(200).json({
    status: 'success',
    message: 'You have been successfully login'
  });

  next();
};

const deleteAllRating = (req, res, next) => {
  console.log(Math.max(...[1, 2, 49]), 'delete');

  res.status(200).json({
    status: 'success',
    message: 'You are permmitted to carry out this operations'
  });

  next();
};

router.route('/').get(auThorization.protectRoutes, getAllRating);

router
  .route('/deleteratings')
  .get(auThorization.protectRoutes, auThorization.roles('organization', 'admin'), deleteAllRating);

module.exports = router;
