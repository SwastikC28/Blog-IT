const asyncHandler = require("../middlewares/async");
const errorHandler = require("../utils/errorHandler");
const User = require("../models/User");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.find({ email });

  if (!email || !password) {
    return next(new errorHandler(`Please provide an email and password`, 401));
  }

  //Checking if User Exists
  if (!user) {
    return next(new errorHandler("Invalid Credentials", 401));
  }

  isMatch = await user.checkPassword(password);

  if (!isMatch) {
    return next(new errorHandler(`Invalid Credentials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

//Get Token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
