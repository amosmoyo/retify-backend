const jwt = require('jsonwebtoken');

const USERS = require('../models/users');

exports.signup = async (req, res) => {
  console.log(req.body.name);

  try {
    const user = await USERS.create(req.body);
    console.log(user);

    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRATION * 1 });

    res.status(201).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      console.log('There is no email or password');
      return res.status(404).json({
        status: 'fail',
        message: 'provide email or password'
      });
    }

    const user = await USERS.findOne({ email }).select('+password');

    console.log(await user.comparePasswords(password, user.password));

    if (!user || !(await user.comparePasswords(password, user.password))) {
      console.log('There ias  an error');
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
    console.log('Amosmoyo');

    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRATION * 1 });

    res.status(200).json({
      status: 'success',
      token,
      user
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};
