const Sequelize = require("sequelize");
const db = require("../config/db");

const Genre = db.define(
  "genres",
  {
    genreName: Sequelize.STRING
  },
  { underscored: true }
);

module.exports = Genre;
