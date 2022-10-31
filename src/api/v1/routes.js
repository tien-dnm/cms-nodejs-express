const express = require("express");
const authRouter = require("./auth/routes");
const userRouter = require("./users/routes");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

module.exports = router;
