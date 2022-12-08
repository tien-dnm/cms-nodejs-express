const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const refreshTokenSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  is_revoked: {
    type: Boolean,
    required: false,
  },
  expires: {
    type: Date,
    required: false,
  },
  is_used: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "refresh_token"
);
