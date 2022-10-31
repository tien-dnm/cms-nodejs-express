const db = require("../../../../config/db");

module.exports = {
  getUser: async (username) => {
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
  createUser: async () => {},
  deleteUser: async () => {},
  getAllUsers: async () => {},
};
