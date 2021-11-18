const asyncHandler = require("../middlewares/async");
const errorHandler = require("../utils/errorHandler");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!email || !password) {
    return next(new errorHandler(`Please provide an email and password`, 401));
  }

  //Checking if User Exists
  if (!user) {
    return next(new errorHandler("Invalid Credentials", 401));
  }

  let isMatch = await user.checkPassword(password);

  if (!isMatch) {
    return next(new errorHandler(`Invalid Credentials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get Currently Logged In User
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.json({ message: "User Logged In", data: user });
});

// Generate Forget Password Token
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  //Checking if User Exists
  if (!user) {
    return next(new errorHandler("User Not Found", 404));
  }

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create Reset URL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetpassword/${resetToken}`;

  console.log(resetURL);
  console.log(resetToken);

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT Request to: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });
    res.status(200).json({
      success: true,
      data: "Email Sent",
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });
  }
});

//@desc  Reset Password Route
//@route PUT /api/auth/resetpassword/:resetToken
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = req.params.resetToken;

  //Get Hashed Token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordToken: { $gt: Date.now() },
  });

  if (!user) {
    return next(new errorHandler(`User not found`, 404));
  }

  // Set new Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, data: user });
});

// Get Token from model,create cookie and send response
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
