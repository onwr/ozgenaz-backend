const { pool, redis } = require("../config/database");

class Comment {
  static async create(bookId, userId, yorum) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO comments (bookId, userId, yorum) VALUES (?, ?, ?)",
        [bookId, userId, yorum]
      );

      await redis.del(`book:${bookId}`);

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getByBookId(bookId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM comments WHERE bookId = ? ORDER BY created_at DESC",
        [bookId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute("DELETE FROM comments WHERE id = ?", [
        id,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Comment;
