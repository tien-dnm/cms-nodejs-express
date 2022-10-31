const db = require("../../../../config/db");

module.exports = {
  getUserByName: async (username) => {
    try {
      const [[user]] = await db.execute(
        "select id, username, is_locked, created_date, modified_date, modified_by from kmk_sys_users where username = ?",
        [username]
      );
      return user;
    } catch {
      return null;
    }
  },
  getUser: async (id) => {
    try {
      const [[user]] = await db.execute(
        "select id, username, is_locked, created_date, modified_date, modified_by from kmk_sys_users where id = ?",
        [id]
      );
      return user;
    } catch {
      return null;
    }
  },
  createUser: async () => {},
  deleteUser: async () => {},
  getAllUsers: async () => {
    try {
      const [users] = await db.execute(
        "select id, username, is_locked, created_date, modified_date, modified_by from kmk_sys_users"
      );
      return users;
    } catch {
      return null;
    }
  },
};
