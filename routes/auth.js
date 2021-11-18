const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
router.route("/logout").get(protect, logout);

module.exports = router;
