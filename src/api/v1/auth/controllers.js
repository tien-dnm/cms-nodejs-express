const randToken = require("rand-token");
const {
  saveRefreshToken,
  useRefreshToken,
  IsValidRefreshToken,
} = require("../refresh_token/methods");
const User = require("../user/model");
const { generateToken, decodeToken } = require("./methods");

module.exports = {
  accessToken: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username }).select(
        "id username email phone_number locked_out is_deleted"
      );
      if (!user) {
        throw new Error("User not found!");
      }
      const payload = { username };
      const accessToken = await generateToken(payload);
      if (!accessToken) {
        return res.status(401).send("Login failed");
      }
      const newRefreshToken = randToken.generate(100);
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

      const user = await User.findOne({ username });

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
