const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getBlog,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog");

const { protect } = require("../middlewares/auth");

router.route("/").get(getBlogs).post(protect, createBlog);
router.route("/:id").get(getBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;
