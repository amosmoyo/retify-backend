const express = require('express');

const protect = require('../controllers/users');

const router = express.Router();

const getAllRating = (req, res) => {
  const { user } = req.user;

  console.log(user, 'hhhhhhh');

  res.status(200).json({
    status: 'success',
    message: 'You have been successfully login',
    user
  });
};

router.route('/').get(protect.protectRoutes, getAllRating);

module.exports = router;
