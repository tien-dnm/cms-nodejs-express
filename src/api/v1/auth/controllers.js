import {
  saveRefreshToken,
  useRefreshToken,
  IsValidRefreshToken,
  generateRefreshToken,
} from "../refresh_token/methods.js";
import User from "../user/model.js";
import { generateToken, decodeToken, verifyPassword } from "./methods.js";

export const accessToken = async (req, res) => {
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

    const access_token = await generateToken(payload);

    if (!access_token) {
      return res.status(401).send("Login failed");
    }

    const { newRefreshToken, refreshTokenExpired } = generateRefreshToken();

    await saveRefreshToken(id, newRefreshToken, refreshTokenExpired);

    return res.json({
      access_token: access_token.token,
      expires_time: access_token.expirytime,
      refresh_token: newRefreshToken,
      user: payload,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.header("authorization") || "";

    const accessTokenFromHeader = authHeader.replace("Bearer ", "");

    if (!accessTokenFromHeader) {
      throw new Error("Invalid access token.");
    }

    const { refresh_token } = req.body;

    if (!refresh_token) {
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

    const isValidRefreshToken = await IsValidRefreshToken(id, refresh_token);

    if (!isValidRefreshToken) {
      throw new Error("Cannot generate new refresh token");
    }

    const access_token = await generateToken(payload);

    if (!access_token) {
      throw new Error("Failed to generate new access token");
    }

    await useRefreshToken(id, refresh_token);

    const { newRefreshToken, refreshTokenExpired } = generateRefreshToken();

    await saveRefreshToken(id, newRefreshToken, refreshTokenExpired);

    return res.json({
      access_token: access_token.token,
      expires_time: access_token.expirytime,
      refresh_token: newRefreshToken,
      user: payload,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
