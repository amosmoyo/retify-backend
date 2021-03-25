const USERS = require('../models/users');

exports.signup = async (req, res) => {
  console.log(req.body);

  try {
    const user = await USERS.create(req.body);
    console.log(user);
    res.status(201).json({
      status: 'success',
      user
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};
