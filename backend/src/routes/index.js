const express = require("express");
const Router = express.Router();

const book = require("./book");
const bookStatus = require("./bookStatus");
const borrow = require("./borrow");
const genre = require("./genre");
const wishlist = require("./wishlist");
const user = require("./user");

Router.use("/book", book);
Router.use("/status", bookStatus);
Router.use("/borrow", borrow);
Router.use("/genre", genre);
Router.use("/wishlist", wishlist);
Router.use("/user", user);

module.exports = Router;
