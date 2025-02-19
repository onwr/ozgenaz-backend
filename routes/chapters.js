const express = require("express");
const router = express.Router();
const Chapter = require("../models/Chapter");
const authMiddleware = require("../middleware/auth");

router.get("/book/:bookId", async (req, res, next) => {
  try {
    const chapters = await Chapter.getByBookId(req.params.bookId);
    res.json(chapters);
  } catch (error) {
    next(error);
  }
});

router.post("/:bookId", authMiddleware, async (req, res, next) => {
  try {
    const result = await Chapter.create(req.params.bookId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = await Chapter.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bölüm bulunamadı" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/like/:id", async (req, res, next) => {
  try {
    const result = await Chapter.incrementLike(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bölüm bulunamadı" });
    }
    res.json({ message: "Beğeni sayısı artırıldı" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const result = await Chapter.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bölüm bulunamadı" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
