const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

router.post("/:bookId", async (req, res, next) => {
  const { userId, yorum } = req.body;

  if (!userId || !yorum) {
    return res.status(400).json({ error: "userId ve yorum zorunludur." });
  }

  try {
    const result = await Comment.create(req.params.bookId, userId, yorum);
    res.status(201).json({ message: "Yorum başarıyla eklendi", result });
  } catch (error) {
    next(error);
  }
});

router.get("/book/:bookId", async (req, res, next) => {
  try {
    const comments = await Comment.getByBookId(req.params.bookId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Comment.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Yorum bulunamadı" });
    }
    res.json({ message: "Yorum başarıyla silindi" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
