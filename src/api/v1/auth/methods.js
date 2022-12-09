import jwt from "jsonwebtoken";
import { promisify } from "util";
import moment from "moment";
import crypto from "crypto";

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

export const generateToken = async (payload) => {
  try {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
    const accessTokenExpired = moment()
      .add(process.env.ACCESS_TOKEN_LIFE, "ms")
      .format("yyyy-MM-DD HH:mm:ss");
    const accessToken = await sign(
      {
        payload,
      },
      accessTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: accessTokenLife,
      }
    );
    return {
      token: accessToken,
      expirytime: accessTokenExpired,
    };
  } catch (error) {
    console.log(`Error in generating access token:  + ${error}`);
    return null;
  }
};
export const decodeToken = async (token) => {
  try {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    return await verify(token, accessTokenSecret, {
      ignoreExpiration: true,
    });
  } catch (error) {
    console.log(`Error in decoding access token: ${error}`);
    return null;
  }
};
export const verifyPassword = (user, password) => {
  try {
    const { password_hash, password_salt } = user;
    const checkPassword = crypto
      .createHash("sha256")
      .update(password + password_salt)
      .digest("hex");
    return checkPassword === password_hash;
  } catch (error) {
    console.log(`Error in verifying password: ${error}`);
    return false;
  }
};
