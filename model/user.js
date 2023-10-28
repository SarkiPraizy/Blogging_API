
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator')
const {isEmail} = require('validator')
const ObjectId = mongoose.Schema.ObjectId;

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    unique: true,
  },

  last_name:{
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
    required: [true, "Email must be provided"],
    validate: [isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: true,
    trim: true,
    required: [true, "Please input your password"],
    minlength: [6, "Minimum password lenght is 6 characters"]
  },

  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password not same"
    },
    trim: true,
    require: [true, "Please input the correct password"]
  }
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {

  console.log(typeof candidatePassword, typeof userPassword)
  return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model('User', userSchema);
module.exports = user;