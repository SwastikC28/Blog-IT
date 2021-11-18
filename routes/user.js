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

// Re-route
router.use("/:userId/blogs", blogRouter);

router.route("/").get(authorize("admin"), getUsers).postauthorize("admin"),
  createUser;
router
  .route("/:id")
  .get(authorize("admin"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

module.exports = router;
