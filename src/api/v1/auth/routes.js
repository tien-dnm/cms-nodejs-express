const express = require("express");
const { accessToken, refreshToken } = require("./controllers");

const router = express.Router();

router.post("/access-token", accessToken);

router.post("/refresh-token", refreshToken);

module.exports = router;
