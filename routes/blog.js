const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getBlog,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getUsersBlog,
} = require("../controllers/blog");

const { protect } = require("../middlewares/auth");

router.route("/").get(getBlogs).post(protect, createBlog);
router.route("/:id").get(getBlog).put(protect, updateBlog).delete(deleteBlog);

module.exports = router;
