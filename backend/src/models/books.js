const Sequelize = require("sequelize");
const db = require("../config/db");

const Book = db.define(
  "books",
  {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    author: Sequelize.STRING,
    image: Sequelize.STRING,
    status: Sequelize.INTEGER,
    genre: Sequelize.INTEGER,
    pages: Sequelize.STRING,
    createdAt: Sequelize.DATEONLY,
    updatedAt: Sequelize.DATEONLY
  },
  { underscored: true }
);

module.exports = Book;
