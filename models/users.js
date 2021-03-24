const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email ']
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'The password must greater than 8 characters']
  },
  passwordCornfirm: {
    type: String,
    required: [true, 'A user must confirm his/her password']
  },
  phoneNumber: {
    type: Number
  },
  idNumber: {
    type: Number
  },
  gender: {
    type: String
  }
});

module.exports = mongoose.model('USERS', userSchema);
