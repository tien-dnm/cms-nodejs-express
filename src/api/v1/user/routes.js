const express = require("express");

const { getAllUsers, getUserById } = require("./controllers");

const router = express.Router();

router.get("", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
