const mongoose = require('mongoose');

const crypto = require('crypto');

const validator = require('validator');

const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name']
  },
  email: {
    type: String,
    unique: [true, 'The user email exist'],
    lowercase: true,
    required: [true, 'A user must have an email'],
    validate: [validator.isEmail, 'Please provide a valid email ']
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'The password must greater than 8 characters'],
    select: false
  },
  passwordCornfirm: {
    type: String,
    required: [true, 'A user must confirm his/her password'],
    validate: {
      validator: function (passConfData) {
        const data = passConfData;
        return data === this.password;
      },
      message: 'The passwords do not match'
    }
  },
  passwordChangeAt: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'organization', 'admin'],
    default: 'user'
  },
  phoneNumber: {
    type: Number,
    unique: [true, 'The phone number must be unique']
  },
  idNumber: {
    type: Number,
    unique: [true, 'The ID must be unique']
  },
  gender: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpire: {
    type: Date
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bycrypt.hash(this.password, 12);
  this.passwordCornfirm = undefined;
  next();
});

// setting the time default time at which a password  was reset
userSchema.pre('save', async function (next) {
  // this middleware chakes weather the password has been changed or not
  if (!this.isModified('password') || this.isMew) {
    return next();
  }

  this.passwordChangeAt = await (Date.now() - 1000); // one second (1sec === 1000 millisecond)
  next();
});

// valiadte the user password during login
userSchema.methods.comparePasswords = async function (loginPass, signupPass) {
  return await bycrypt.compare(loginPass, signupPass);
};

userSchema.methods.passwordChangeAfter = function (jwtTimeStamp) {
  if (this.passwordChangeAt) {
    console.log(this.passwordChangeAt, 'kiikik');
    const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    console.log(changedTimestamp - jwtTimeStamp);
    console.log(jwtTimeStamp < changedTimestamp, 'lkkikik', changedTimestamp, jwtTimeStamp);
    return jwtTimeStamp < changedTimestamp;
  }

  // password not changed (jwtTimeStamp) < changedTimestamp -> passcreation time
  console.log('i know');
  return false;
};

// Generate a random fake token to stand in the place of jwt
userSchema.methods.creatPasswordResetToken = function () {
  // a weak random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // encrypting the token for safer storage and storing it in the database
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  console.log({ resetToken }, this.passwordResetToken, this.passwordResetExpire, '%%%%%');

  return resetToken;
};

module.exports = mongoose.model('USERS', userSchema);
