const express = require("express");
const Router = express.Router();
const { verifyMember, verifyAdmin, verifyToken } = require("../helpers/auth");
const {
  getBook,
  getSelectedBook,
  addBook,
  editBook,
  deleteBook
} = require("../controllers/book");

Router.get("/", getBook);
Router.get("/detail/:id", verifyToken, verifyMember, getSelectedBook);
Router.post("/", verifyToken, verifyAdmin, addBook);
Router.patch("/update/:id", verifyToken, verifyAdmin, editBook);
Router.delete("/delete/:id", verifyToken, verifyAdmin, deleteBook);

module.exports = Router;
