const fs = require("fs");
const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");

// Load env Variables
dotenv.config({ path: "./config/config.env" });

// Load Models
const User = require("./models/User");
const Blog = require("./models/Blog");

// Connect to Database
mongoose.connect(process.env.MONGO_URL);

// Read JSON Files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    console.log("Data Imported Successfully".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log("Data Deleted Successfully".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
