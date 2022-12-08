const {
  saveRefreshToken,
  useRefreshToken,
  IsValidRefreshToken,
  generateRefreshToken,
} = require("../refresh_token/methods");
const User = require("../user/model");
const { generateToken, decodeToken, verifyPassword } = require("./methods");

module.exports = {
  accessToken: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({
        username,
        is_deleted: { $ne: true },
      });

      if (!user) {
        return res.status(404).send("User not found!");
      }

      const { id, email, phone_number, locked_out } = user;

      if (locked_out) {
        return res.status(401).send("User account has been locked out");
      }

      const isPasswordValid = verifyPassword(user, password);

      if (!isPasswordValid) {
        return res.status(401).send("Invalid username or password");
      }

      const payload = {
        id,
        username,
        email,
        phone_number,
      };

      const accessToken = await generateToken(payload);

      if (!accessToken) {
        return res.status(401).send("Login failed");
      }

      const { newRefreshToken, refreshTokenExpired } = generateRefreshToken();

      await saveRefreshToken(id, newRefreshToken, refreshTokenExpired);

      return res.json({
        accessToken: accessToken.token,
        accessTokenExpiryTime: accessToken.expirytime,
        refreshToken: newRefreshToken,
        user: payload,
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

      const decoded = await decodeToken(accessTokenFromHeader);

      if (!decoded) {
        throw new Error("Invalid access token.");
      }

      const { id } = decoded.payload;

      const user = await User.findById(id);

      if (!user) {
        throw new Error("User not found!");
      }
      const { username, email, phone_number, locked_out } = user;

      if (locked_out) {
        return res.status(401).send("User account has been locked out");
      }

      const payload = {
        id,
        username,
        email,
        phone_number,
      };

      const isValidRefreshToken = await IsValidRefreshToken(id, refreshToken);

      if (!isValidRefreshToken) {
        throw new Error("Cannot generate new refresh token");
      }

      const accessToken = await generateToken(payload);

      if (!accessToken) {
        throw new Error("Failed to generate new access token");
      }

      await useRefreshToken(id, refreshToken);

      const { newRefreshToken, refreshTokenExpired } = generateRefreshToken();

      await saveRefreshToken(id, newRefreshToken, refreshTokenExpired);

      return res.json({
        accessToken: accessToken.token,
        accessTokenExpiryTime: accessToken.expirytime,
        refreshToken: newRefreshToken,
        user: payload,
      });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },
};
