const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const moment = require("moment");

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

module.exports = {
  generateToken: async (payload) => {
    try {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
      const accessTokenExpired = moment()
        .add(1, "days")
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
      console.log(`Error in generate access token:  + ${error}`);
      return null;
    }
  },
  decodeToken: async (token) => {
    try {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      return await verify(token, accessTokenSecret, {
        ignoreExpiration: true,
      });
    } catch (error) {
      console.log(`Error in decode access token: ${error}`);
      return null;
    }
  },
};
