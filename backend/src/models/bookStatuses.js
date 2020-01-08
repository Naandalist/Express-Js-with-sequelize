const Sequelize = require("sequelize");
const db = require("../config/db");

const BookStatus = db.define(
  "book_statuses",
  {
    statusName: Sequelize.STRING
  },
  { underscored: true }
);

module.exports = BookStatus;
