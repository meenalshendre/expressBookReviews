const express = require("express");
const axios = require("axios");
const books = require("../data/books");

const router = express.Router();
const users = new Map();
const sessions = new Map();

function findBookByISBN(isbn) {
  return books[isbn] || null;
}

function publicBook(book) {
  return {
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    reviews: book.reviews
  };
}

// Task 11: retrieve all books and filter by author, title, or ISBN using Axios
// with async/await. The helper calls this project's own API.
async function retrieveBooks({ isbn, author, title } = {}) {
  const response = await axios.get("http://localhost:" + (process.env.PORT || 5000) + "/books");
  let result = response.data;
  if (isbn) result = result.filter(book => String(book.isbn).toLowerCase() === String(isbn).toLowerCase());
  if (author) result = result.filter(book => String(book.author).toLowerCase().includes(String(author).toLowerCase()));
  if (title) result = result.filter(book => String(book.title).toLowerCase().includes(String(title).toLowerCase()));
  return result;
}

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express Book Review API" });
});

router.get("/books", (req, res) => {
  res.json(Object.values(books).map(publicBook));
});

router.get("/books/isbn/:isbn", (req, res) => {
  const book = findBookByISBN(req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(publicBook(book));
});

router.get("/books/author/:author", async (req, res) => {
  try {
    const results = await retrieveBooks({ author: req.params.author });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve books", error: error.message });
  }
});

router.get("/books/title/:title", async (req, res) => {
  try {
    const results = await retrieveBooks({ title: req.params.title });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve books", error: error.message });
  }
});

router.get("/books/review/:isbn", (req, res) => {
  const book = findBookByISBN(req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book.reviews);
});

router.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }
  if (users.has(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.set(username, { username, password });
  res.status(201).json({ message: "User registered successfully", username });
});

router.post("/customer/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = users.get(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = `session-${username}`;
  sessions.set(token, username);
  res.json({ message: "Login successful", username, token });
});

function authenticatedUser(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  return sessions.get(token);
}

router.put("/customer/auth/review/:isbn", (req, res) => {
  const username = authenticatedUser(req);
  if (!username) return res.status(401).json({ message: "Please log in first" });
  const book = findBookByISBN(req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  const { review } = req.body || {};
  if (!review) return res.status(400).json({ message: "review is required" });
  book.reviews[username] = review;
  res.json({ message: "Review added or updated successfully", isbn: book.isbn, reviews: book.reviews });
});

router.delete("/customer/auth/review/:isbn", (req, res) => {
  const username = authenticatedUser(req);
  if (!username) return res.status(401).json({ message: "Please log in first" });
  const book = findBookByISBN(req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  if (!Object.prototype.hasOwnProperty.call(book.reviews, username)) {
    return res.status(404).json({ message: "No review found for this user" });
  }
  delete book.reviews[username];
  res.json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports = router;
