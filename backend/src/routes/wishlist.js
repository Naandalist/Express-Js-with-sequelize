const express = require("express");
const Router = express.Router();
const { verifyMember, verifyToken } = require("../helpers/auth");
const {
  getAllWishlist,
  addWishlist,
  deleteWishlist,
  checkWishlist
} = require("../controllers/wishlist");

Router.get("/:user_id", verifyToken, verifyMember, getAllWishlist);
Router.get("/check/wish", verifyToken, verifyMember, checkWishlist);
Router.post("/:user_id", verifyToken, verifyMember, addWishlist);
Router.delete("/delete/:user_id", verifyToken, verifyMember, deleteWishlist);

module.exports = Router;
