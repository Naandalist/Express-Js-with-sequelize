const Sequelize = require("sequelize");

const database = process.env.DB_NAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

module.exports = new Sequelize(database, username, password, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});
