const express = require("express");
const Router = express.Router();
const { getGenre } = require("../controllers/genre");

Router.get("/", getGenre);

module.exports = Router;
