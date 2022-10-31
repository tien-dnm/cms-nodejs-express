const moment = require("moment");
const randToken = require("rand-token");
const db = require("../../../../config/db");

module.exports = {
  saveRefreshToken: async (username) => {
    try {
      const refreshToken = randToken.generate(100);

      const refreshTokenExpired = moment()
        .add(4, "days")
        .format("yyyy-MM-DD HH:mm:ss");

      await db.execute("call sp_kmk_user_refresh_token('NEW',?,?,?)", [
        username,
        refreshToken,
        refreshTokenExpired,
      ]);

      return refreshToken;
    } catch (error) {
      console.log(error);
      throw new Error("Cannot generate new refresh token!");
    }
  },
  useRefreshToken: async (username, refreshToken) => {
    await db.execute("call sp_kmk_user_refresh_token('USE',?,?,?)", [
      username,
      refreshToken,
      null,
    ]);
  },
  IsValidRefreshToken: async (username, refreshToken) => {
    const [checkRefreshtoken] = await db.execute(
      `select refresh_token from kmk_sys_user_refresh_token where refresh_token = ? and username = ? and expiry_time > now() and is_revoked = 0 and is_used = 0`,
      [refreshToken, username]
    );
    return checkRefreshtoken.length !== 0;
  },
};
