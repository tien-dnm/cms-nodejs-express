const randToken = require("rand-token");
const moment = require("moment");
const mongoose = require("mongoose");
const RefreshToken = require("./model");

module.exports = {
  generateRefreshToken: () => {
    const newRefreshToken = randToken.generate(100);
    const refreshTokenExpired = moment()
      .add(process.env.REFRESH_TOKEN_LIFE, "ms")
      .format("yyyy-MM-DD HH:mm:ss");
    return {
      newRefreshToken,
      refreshTokenExpired,
    };
  },
  saveRefreshToken: async (user_id, refreshToken, refreshTokenExpired) => {
    try {
      const newRefreshToken = new RefreshToken({
        _id: mongoose.Types.ObjectId(),
        user_id,
        token: refreshToken,
        expires: refreshTokenExpired,
        is_revoked: false,
        is_used: false,
      });
      newRefreshToken.save();
    } catch (error) {
      throw new Error("Cannot generate new refresh token!");
    }
  },
  useRefreshToken: async (user_id, refreshToken) => {
    try {
      await RefreshToken.findOneAndUpdate(
        { user_id, token: refreshToken },
        { is_used: true },
        { new: true, upsert: false }
      );
    } catch (error) {
      throw new Error("Cannot use refresh token!");
    }
  },
  IsValidRefreshToken: async (user_id, refreshToken) => {
    const currentDate = new Date().toISOString();
    const checkRefreshToken = await RefreshToken.findOne({
      user_id,
      token: refreshToken,
      expires: { $gte: currentDate },
      is_used: { $ne: true },
      is_revoked: { $ne: true },
    });
    return checkRefreshToken !== null;
  },
};
