const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

// Get blogs router
const blogRouter = require("./blog");

const { protect, authorize } = require("../middlewares/auth");

router.use(protect);
router.use(authorize("admin"));

// Re-route
router.use("/:userId/blogs", blogRouter);

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
