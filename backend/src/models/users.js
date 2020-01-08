const Sequelize = require("sequelize");
const db = require("../config/db");

const User = db.define(
  "users",
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    avatar: Sequelize.STRING,
    role: Sequelize.STRING,
    createdAt: Sequelize.DATEONLY,
    updatedAt: Sequelize.DATEONLY
  },
  {
    underscored: true
  }
);

module.exports = User;
