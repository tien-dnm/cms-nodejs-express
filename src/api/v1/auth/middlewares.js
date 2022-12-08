const User = require("../user/methods");
const authMethod = require("./methods");

module.exports = {
  isAuth: async (req, res, next) => {
    // Lấy access token từ header
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
      return res.status(401).send("Không tìm thấy access token!");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const verified = await authMethod.verifyToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    if (!verified) {
      return res
        .status(401)
        .send("Bạn không có quyền truy cập vào tính năng này!");
    }

    const user = await User;
    req.user = user;

    return next();
  },
};
