const asyncHandler = require("../middlewares/async");
const errorHandler = require("../utils/errorHandler");
const Blog = require("../models/Blog");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookie.token) {
    token = req.cookie.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new errorHandler(`Not authorized to access this route`, 401));
  }

  try {
    // Verify Token
    const decoded = await jwt.decode(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.log(err);
    return next(new errorHandler(`Server Error`, 500));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(
          `User with role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
