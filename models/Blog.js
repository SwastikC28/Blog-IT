const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide title of the blog."],
  },

  content: {
    type: String,
    required: [true, "Please provide content of the blog."],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
