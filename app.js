const express = require("express");
const booksRouter = require("./routes/general");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", booksRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Book review API running on http://localhost:${PORT}`);
});
