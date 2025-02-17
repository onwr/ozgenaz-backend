const { pool, redis } = require("../config/database");

class Book {
  static async getById(id) {
    const cacheKey = `book:${id}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const [rows] = await pool.execute(
        "SELECT * FROM books WHERE kitapId = ?",
        [id]
      );

      if (rows[0]) {
        await redis.set(cacheKey, JSON.stringify(rows[0]), "EX", 300);
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM books LIMIT ? OFFSET ?",
        [limit, offset]
      );
      const [count] = await pool.execute("SELECT COUNT(*) as total FROM books");

      return {
        books: rows,
        total: count[0].total,
        page,
        totalPages: Math.ceil(count[0].total / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(bookData) {
    try {
      const kitapId = bookData.kitapId || null;
      const kitapAd = bookData.kitapAd || null;
      const okumaSayi = bookData.okumaSayi || 0;
      const aciklama = bookData.aciklama || null;
      const resim = bookData.resim || null;

      if (!kitapId || !kitapAd) {
        throw new Error("kitapId ve kitapAd zorunlu alanlardır");
      }

      const [result] = await pool.execute(
        "INSERT INTO books (kitapId, kitapAd, okumaSayi, aciklama, resim) VALUES (?, ?, ?, ?, ?)",
        [kitapId, kitapAd, okumaSayi, aciklama, resim]
      );

      return {
        success: true,
        id: result.insertId,
        message: "Kitap başarıyla eklendi",
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id, bookData) {
    const { kitapAd, okumaSayi, aciklama, resim } = bookData;

    try {
      const [result] = await pool.execute(
        "UPDATE books SET kitapAd = ?, okumaSayi = ?, aciklama = ?, resim = ? WHERE kitapId = ?",
        [kitapAd, okumaSayi, aciklama, resim, id]
      );

      await redis.del(`book:${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        "DELETE FROM books WHERE kitapId = ?",
        [id]
      );

      await redis.del(`book:${id}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Book;
