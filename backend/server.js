require("dotenv").config();
const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./src/config/db");
const route = require("./src/routes");

const server = express();
const PORT = process.env.PORT || 7777;

server.use(cors());
server.use(morgan("dev"));
server.use(express.static("./public"));
server.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./public/pictures"
  })
);
server.use("/api/v1", route);
server.get("/api/v1", (req, res) => {
  res.json({
    code: 200,
    status: "OK",
    message: "Welcome to Booklibs API"
    // author: "Listiananda Apriliawan"
  });
});
server.get("*", (req, res) => {
  res.status(400).json({
    code: 400,
    status: "Not Found",
    message: "Sorry, route you looking for doesn't exist..."
  });
});
const start = async () => {
  try {
    await db.authenticate();
    http.createServer(server).listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log("An error occured whil connecting to database:", error);
  }
};
start();
