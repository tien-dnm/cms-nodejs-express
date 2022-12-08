const express = require("express");

const { getAllUsers, getUserById, filterUsers } = require("./controllers");

const router = express.Router();

router.get("", getAllUsers);
router.get("/filter", filterUsers);
router.get("/:id", getUserById);

module.exports = router;
