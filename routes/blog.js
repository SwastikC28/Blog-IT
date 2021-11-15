const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getBlog,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog");

router.route("/").get(getBlogs).post(createBlog);
router.route("/:id").get(getBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;
