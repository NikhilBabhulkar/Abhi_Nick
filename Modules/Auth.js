const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiration: {
    type: Date,
    default: null
  }
});

const User = mongoose.model('patient', userSchema);

module.exports = User;
