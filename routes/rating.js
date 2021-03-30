const express = require('express');

const auThorization = require('../controllers/users');

const router = express.Router();

const getAllRating = (req, res) => {
  console.log(Math.max(...[1, 2, 49]));

  res.status(200).json({
    status: 'success',
    message: 'You have been successfully login'
  });
};

const deleteAllRating = (req, res) => {
  console.log(Math.max(...[1, 2, 49]));

  res.status(200).json({
    status: 'success',
    message: 'You are permmitted to carry out this operations'
  });
};

router.route('/').get(auThorization.protectRoutes, getAllRating);

router
  .route('/deleteratings')
  .get(auThorization.protectRoutes, auThorization.roles('organization', 'admin'), deleteAllRating);

module.exports = router;
