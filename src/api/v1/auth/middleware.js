import User from "../user/model.js";
import { decodeToken } from "./methods.js";
// const User = require("../user/model");
// const { decodeToken } = require("./methods");

const isAuth = async (req, res, next) => {
  const authHeader = req.header("authorization") || "";

  const accessTokenFromHeader = authHeader.replace("Bearer ", "");

  if (!accessTokenFromHeader) {
    return res.status(401).send("Invalid access token.");
  }

  const verified = await decodeToken(accessTokenFromHeader);

  if (!verified) {
    return res.status(401).send("Unauthorized!");
  }

  const { payload } = verified;

  req.user = payload;

  return next();
};

export default isAuth;
