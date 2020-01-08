const express = require("express");
const Router = express.Router();
const { verifyMember, verifyToken } = require("../helpers/auth");
const {
  getBorrow,
  checkBorrow,
  addBorrow,
  updateBorrow
} = require("../controllers/borrow");

Router.get("/:user_id", verifyToken, verifyMember, getBorrow);
Router.get("/check/borrow", verifyToken, verifyMember, checkBorrow);
Router.post("/:user_id", verifyToken, verifyMember, addBorrow);
Router.patch("/:user_id", verifyToken, verifyMember, updateBorrow);

module.exports = Router;
