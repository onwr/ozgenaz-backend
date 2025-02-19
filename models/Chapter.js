const { pool, redis } = require("../config/database");

class Chapter {
  static async getByBookId(bookId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM chapters WHERE bookId = ? ORDER BY created_at",
        [bookId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(bookId, chapterData) {
    const { baslik, begeniSayi, content } = chapterData;

    try {
      const [result] = await pool.execute(
        "INSERT INTO chapters (bookId, baslik, begeniSayi, content) VALUES (?, ?, ?, ?)",
        [bookId, baslik, begeniSayi, content]
      );

      await redis.del(`book:${bookId}`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async incrementLike(id) {
    try {
      const [result] = await pool.execute(
        "UPDATE chapters SET begeniSayi = begeniSayi + 1 WHERE id = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, chapterData) {
    const { baslik, begeniSayi, content } = chapterData;

    try {
      const [result] = await pool.execute(
        "UPDATE chapters SET baslik = ?, begeniSayi = ?, content = ? WHERE id = ?",
        [baslik, begeniSayi, content, id]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute("DELETE FROM chapters WHERE id = ?", [
        id,
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Chapter;
