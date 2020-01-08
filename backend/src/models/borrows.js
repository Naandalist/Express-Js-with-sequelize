const Sequelize = require("sequelize");
const db = require("../config/db");

const Borrow = db.define(
  "borrows",
  {
    // bookId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    bookId: Sequelize.INTEGER,
    isReturn: Sequelize.INTEGER,
    createdAt: Sequelize.DATEONLY,
    updatedAt: Sequelize.DATEONLY
  },
  { underscored: true }
);

module.exports = Borrow;
