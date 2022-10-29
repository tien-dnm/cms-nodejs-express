const moment = require("moment/moment");
const randToken = require("rand-token");
const db = require("../../config/db");
const authMethod = require("./methods");

module.exports = {
  accessToken: async (req, res) => {
    try {
      const { username, password } = req.body;

      const [[user]] = await db.execute(
        "select id,username from kmk_sys_users where username = ?",
        [username]
      );

      if (!user) {
        return res.status(400).send("User not found!");
      }

      db.execute("call sp_kmk_user_login(?,?)", [username, password]);

      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const userClaims = { username };

      const accessToken = await authMethod.generateToken(
        userClaims,
        accessTokenSecret,
        accessTokenLife
      );

      if (!accessToken) {
        return res.status(401).send("Login failed");
      }

      const refreshToken = randToken.generate(100);
      const expired = moment().add(2, "days").format("yyyy-MM-DD HH:mm:ss");

      db.execute("call sp_kmk_user_refresh_token('NEW',?,?,?)", [
        username,
        refreshToken,
        expired,
      ]);

      return res.json({
        msg: "Login successful.",
        accessToken,
        refreshToken,
        expired,
        user,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
  refreshToken: async (req, res) => {
    try {
      const authHeader = req.header("authorization") || "";

      const accessTokenFromHeader = authHeader.replace("Bearer ", "");

      if (!accessTokenFromHeader) {
        return res.status(400).send("Invalid access token.");
      }

      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).send("Invalid refresh token.");
      }

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

      const decoded = await authMethod.decodeToken(
        accessTokenFromHeader,
        accessTokenSecret
      );

      if (!decoded) {
        return res.status(400).send("Access token không hợp lệ.");
      }

      const { username } = decoded.payload;

      const [[user]] = await db.execute(
        "select id,username from kmk_sys_users where username = ?",
        [username]
      );

      if (!user) {
        return res.status(400).send("User not found!");
      }

      const userClaims = {
        username: user.username,
      };

      const [checkRefreshtoken] = await db.execute(
        `select refresh_token from kmk_sys_user_refresh_token  where refresh_token = ?  and username = ?  and expiry_time > now() and is_revoked = 0 and is_used = 0`,
        [refreshToken, username]
      );

      if (checkRefreshtoken.length === 0) {
        return res.status(400).send("Invalid refresh token");
      }

      const accessToken = await authMethod.generateToken(
        userClaims,
        accessTokenSecret,
        accessTokenLife
      );

      if (!accessToken) {
        return res.status(400).send("Failed to generate new access token");
      }

      const newRefreshToken = randToken.generate(100);
      const expired = moment().add(2, "days").format("yyyy-MM-DD HH:mm:ss");

      db.execute("call sp_kmk_user_refresh_token('USE',?,?,?)", [
        username,
        refreshToken,
        null,
      ]);

      db.execute("call sp_kmk_user_refresh_token('NEW',?,?,?)", [
        username,
        newRefreshToken,
        expired,
      ]);

      return res.json({
        msg: "Refresh successful.",
        accessToken,
        refreshToken,
        expired,
        user,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
};
