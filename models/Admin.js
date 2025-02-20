// models/adminModel.js
const db = require("../config/database");
const bcrypt = require("bcrypt");

class Admin {
  static async findByUsername(username) {
    try {
      const [admin] = await db.execute(
        "SELECT * FROM admins WHERE username = ?",
        [username]
      );
      return admin[0];
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Admin;
