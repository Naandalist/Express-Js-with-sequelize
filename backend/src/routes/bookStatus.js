const express = require("express");
const Router = express.Router();
const { getAllStatus } = require("../controllers/bookStatus");

Router.get("/", getAllStatus);

module.exports = Router;
