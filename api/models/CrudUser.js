/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const crudUserSchema = new mongoose.Schema({
  useremailLog:{
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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
  addedtimestamp: {
    type: Date,
    required:true,
  },
  edittimestamp:{
    type: Date,
    required:true,
  },
});


module.exports = mongoose.model("CrudUser1", crudUserSchema);
