/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  heardFrom: {
    type: Array,
    default: [],
  },
  city:{
    type: String,
    required: true,
  },
  state:{
    type: String,
    required: true,
  },
});


module.exports = mongoose.model("User", userSchema);
