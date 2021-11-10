const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const morgan = require("morgan");

//Initializing env var
dotenv.config({ path: "./config/config.env" });

//Initializing
const app = express();

//Connecting To The Database
connectDB();

let PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(
    `Server Started on PORT ${PORT} on ${process.env.NODE_ENV} mode`.blue
  );
});
