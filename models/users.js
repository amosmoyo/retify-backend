const mongoose = require('mongoose');

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

userSchema.methods.comparePasswords = async function (loginPass, signupPass) {
  console.log('Amso');
  return await bycrypt.compare(loginPass, signupPass);
};

module.exports = mongoose.model('USERS', userSchema);
