import randToken from "rand-token";
import crypto from "crypto";
import User from "./model.js";

// ==================================================================
export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find(
      {
        is_deleted: {
          $ne: true,
        },
      },
      "-password_hash -password_salt"
    );

    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// ==================================================================
export const filterUsers = async (req, res) => {
  try {
    const removeItems = ["page", "size"];

    const { page, size } = req.query;

    const limit = size;

    const skip = size >= 1 ? (page > 1 ? page - 1 : 0) * size : 0;

    const cloneQuery = { ...req.query };

    removeItems.forEach((item) => delete cloneQuery[item]);

    const jsonStringQuery = JSON.stringify(cloneQuery).replace(
      /\b(eq|ne|gt|gte|lt|lte|regex)\b/g,
      (key) => `$${key}`
    );
    const actualQuery = JSON.parse(jsonStringQuery);

    const users = await User.find(
      actualQuery,
      "-password_hash -password_salt",
      {
        skip,
        limit,
      }
    );

    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// ==================================================================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(
      id,
      "-password_hash -password_salt"
    );

    if (user) {
      res.json(user);
    } else {
      res.status(400).send("User not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      username,
      password,
      confirm_password,
      email,
      phone_number,
    } = req.body;
    if (!username || !password || !confirm_password) {
      res.status(400).send("Invalid Request");
    }
    if (password !== confirm_password) {
      res.status(400).send("Password does not match");
    }
    const password_salt = randToken.generate(69);
    const password_hash = crypto
      .createHash("sha256")
      .update(password + password_salt)
      .digest("hex");
    const user = await User.create({
      username,
      password_hash,
      password_salt,
      email,
      phone_number,
    });
    const queryUser = await User.findById(
      // eslint-disable-next-line no-underscore-dangle
      user._id,
      "-password_hash -password_salt"
    );
    return res.status(201).json(queryUser);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(
      id,
      "-password_hash -password_salt"
    );

    if (!user) {
      res.status(400).send("User not found");
    }

    const { email, phone_number } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        phone_number,
        modified_date: new Date().toISOString(),
        modified_by: "",
      },
      {
        new: true,
        upsert: false,
        select: "-password_hash -password_salt",
      }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(
      id,
      "-password_hash -password_salt"
    );

    if (!user) {
      res.status(400).send("User not found");
    }

    await User.findByIdAndUpdate(
      id,
      {
        is_deleted: true,
        deleted_date: new Date().toISOString(),
        deleted_by: "",
      },
      {
        new: true,
        upsert: false,
        select: "-password_hash -password_salt",
      }
    );

    return res.status(204).json("Deleted");
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
