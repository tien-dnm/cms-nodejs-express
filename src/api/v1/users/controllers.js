const { getUser, getAllUsers } = require("./methods");

module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getUserById: async (req, res) => {
    try {
      const id = req.params.id || req.query.id;
      const user = await getUser(id);
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
