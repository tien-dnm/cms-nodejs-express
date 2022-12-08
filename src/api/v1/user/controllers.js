const User = require("./model");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find({}, "-password_hash -password_salt");

      res.json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  filterUsers: async (req, res) => {
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
  },
  getUserById: async (req, res) => {
    try {
      const id = req.params.id || req.query.id;

      const user = await User.findById(id, "-password_hash -password_salt");

      if (user) {
        res.json(user);
      } else {
        res.status(400).send("User not found");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
