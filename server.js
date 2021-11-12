const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const morgan = require("morgan");
const errorHandler = require("./middlewares/error");

//Initializing env var
dotenv.config({ path: "./config/config.env" });

// Requiring Routers
const user = require("./routes/user");

//Initializing
const app = express();
app.use(express.json());

//Connecting To The Database
connectDB();

// Mounting Routers
app.use("/api/user", user);

// Using Middlewares
app.use(errorHandler);

let PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(
    `Server Started on PORT ${PORT} on ${process.env.NODE_ENV} mode`.blue
  );
});
