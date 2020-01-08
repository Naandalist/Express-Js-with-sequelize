const Sequelize = require("sequelize");
const db = require("../config/db");

const Wishlist = db.define(
  "wishlists",
  {
    idUser: Sequelize.INTEGER,
    idBook: Sequelize.INTEGER
  },
  { underscored: true }
);

module.exports = Wishlist;
