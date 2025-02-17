const express = require("express");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const booksRouter = require("./routes/books");
const chaptersRouter = require("./routes/chapters");
const commentsRouter = require("./routes/comments");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1200,
});
app.use(limiter);

app.use("/books", booksRouter);
app.use("/chapters", chaptersRouter);
app.use("/comments", commentsRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint bulunamadı" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
