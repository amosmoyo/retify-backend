const jwt = require('jsonwebtoken');

const util = require('util');

const USERS = require('../models/users');

exports.signup = async (req, res) => {
  console.log(req.body.name);

  try {
    const user = await USERS.create(req.body);
    console.log(user);

    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRATION });

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

    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRATION });

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

// protecting our route
exports.protectRoutes = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    console.log('amosmoyodata');
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not login'
    });
  }

  // verify our token
  try {
    const decoded = await util.promisify(jwt.verify)(token, process.env.SECRETKEY);

    const existingUser = await USERS.findOne({ _id: decoded.id });

    console.log(decoded);

    if (!existingUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user no longer  not exist'
      });
    }

    if (existingUser.passwordChangeAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User password has changed, please login again'
      });
    }

    req.user = existingUser;
    next();
  } catch (error) {
    console.log('Myeeeeerrrr', error);
    return res.status(401).json({
      status: 'fail',
      message: error
    });
  }
};
