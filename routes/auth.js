const express = require("express");
const router = express.Router({ mergeParams: true });

const { register, login } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
