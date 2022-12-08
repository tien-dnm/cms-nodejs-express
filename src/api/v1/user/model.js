const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: false,
  },
  password_salt: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  email_confirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  phone_number: {
    type: String,
    required: false,
  },
  phone_number_confirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  access_failed_count: {
    type: Number,
    required: false,
  },
  locked_out: {
    type: Boolean,
    required: false,
    default: false,
  },
  locked_out_end: {
    type: Date,
    required: false,
  },
  created_date: {
    type: Date,
    required: false,
    default: new Date().toISOString(),
  },
  created_by: {
    type: String,
    required: false,
  },
  modified_date: {
    type: Date,
    required: false,
  },
  modified_by: {
    type: String,
    required: false,
  },
  is_deleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  deleted_date: {
    type: Date,
    required: false,
  },
  deleted_by: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema, "user");
