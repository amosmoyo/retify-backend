const jwt = require('jsonwebtoken');

const util = require('util');

const crypto = require('crypto');

const USERS = require('../models/users');

const sendData = require('../utils/email');

// Create a status message
const statusMessage = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: process.env.EXPIRATION });

  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};

// create a new USER
exports.signup = async (req, res, next) => {
  try {
    const user = await USERS.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordCornfirm: req.body.passwordCornfirm,
      passwordChangeAt: req.body.passwordChangeAt,
      role: req.body.role,
      phoneNumber: req.body.phoneNumber,
      idNumber: req.body.idNumber,
      gender: req.body.gender
    });

    statusMessage(user, 201, res);

    next();
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

// Login an existing user (authentifications)
exports.login = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        status: 'fail',
        message: 'provide email or password'
      });
    }

    const user = await USERS.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password, user.password))) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    statusMessage(user, 200, res);

    next();
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

// protecting our routes (Only login user can carry out this operations)
exports.protectRoutes = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
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

    req.userdata = existingUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: error
    });
  }
};

// authorization roles
exports.roles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userdata.role)) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not permitted to carryout this operations'
    });
  }

  console.log(req.userdata, 'roles');

  next();
};

// sending email incase the user has forgotten his/her password
exports.passwordForget = async (req, res, next) => {
  // find the user who password is forgotten
  const user1 = await USERS.findOne({ email: req.body.email });
  // validate the pressence of the user
  if (!user1) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no user with that email in this DB'
    });
  }

  // Generate a random fake token to stand in the place of jwt
  const resetToken = user1.creatPasswordResetToken();
  await user1.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

  const text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendData({ email: user1.email, subject: 'You password reset token (valid for 10 min)', text });

    res.status(200).json({
      status: 'success',
      message: 'You can confirm your email a password reset token has been send'
    });

    next();
  } catch (error) {
    user1.passwordResetToken = undefined;
    user1.passwordResetExpire = undefined;
    await user1.save({ validateBeforeSave: false });
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: error
    });
  }
};

// setting a new password (password reset functionality);
exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await USERS.findOne({ passwordResetToken: hashedToken, passwordResetExpire: { $gt: Date.now() } });

  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'The token is invalid or has expired'
    });
  }

  try {
    user.password = req.body.password;
    user.passwordCornfirm = req.body.passwordCornfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    statusMessage(user, 200, res);

    next();
  } catch (error) {
    return res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

// updating user password while he/she is login
exports.passwordUpdate = async (req, res, next) => {
  /*let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token, 'data');
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not login'
    });
  }*/

  try {
    // const decoded = await util.promisify(jwt.verify)(token, process.env.SECRETKEY);

    const existingUser = await USERS.findOne({ _id: req.userdata._id }).select('+password');
    console.log(req.body, req.userdata);
    if (!(await existingUser.comparePasswords(req.body.currentPass, existingUser.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'The password you enter does not match the existing one'
      });
    }

    existingUser.password = req.body.password;
    existingUser.passwordCornfirm = req.body.passwordCornfirm;
    existingUser.passwordResetToken = undefined;
    existingUser.passwordResetExpire = undefined;
    await existingUser.save();

    statusMessage(existingUser, 200, res);

    next();
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
