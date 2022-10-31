const db = require("../../../../config/db");
const {
  saveRefreshToken,
  useRefreshToken,
  IsValidRefreshToken,
} = require("../refresh_token/methods");
const { getUser } = require("../users/methods");
const { generateToken, decodeToken } = require("./methods");

module.exports = {
  accessToken: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await getUser(username);
      if (!user) {
        throw new Error("User not found!");
      }
      // verify username and password
      await db.execute("call sp_kmk_user_login(?,?)", [username, password]);

      const userClaims = { username };

      const accessToken = await generateToken(userClaims);

      if (!accessToken) {
        return res.status(401).send("Login failed");
      }

      const newRefreshToken = await saveRefreshToken(username);

      return res.json({
        accessToken: accessToken.token,
        accessTokenExpiryTime: accessToken.expirytime,
        refreshToken: newRefreshToken,
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
        throw new Error("Invalid access token.");
      }

      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new Error("Invalid refresh token.");
      }

      // decode access token to to get userClaims
      const decoded = await decodeToken(accessTokenFromHeader);

      if (!decoded) {
        throw new Error("Invalid access token.");
      }

      const { username } = decoded.payload;

      const user = await getUser(username);

      if (!user) {
        throw new Error("User not found!");
      }

      const userClaims = { username };

      const isValidRfTk = await IsValidRefreshToken(username, refreshToken);

      if (!isValidRfTk) {
        throw new Error("Invalid refresh token");
      }

      const accessToken = await generateToken(userClaims);

      if (!accessToken) {
        throw new Error("Failed to generate new access token");
      }

      await useRefreshToken(username, refreshToken);

      const newRefreshToken = await saveRefreshToken(username);

      return res.json({
        accessToken: accessToken.token,
        accessTokenExpiryTime: accessToken.expirytime,
        refreshToken: newRefreshToken,
        user,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
};
