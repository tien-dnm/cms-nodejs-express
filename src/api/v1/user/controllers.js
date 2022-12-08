const User = require("./model");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find({});
      res.json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getUserById: async (req, res) => {
    try {
      const id = req.params.id || req.query.id;
      const user = await User.findById(id);
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
