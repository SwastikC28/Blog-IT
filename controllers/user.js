const asyncHandler = require("../middlewares/async");
const errorHandler = require("../utils/errorHandler");
const User = require("../models/User");

//request GET
//@route /api/user
//access PRIVATE
exports.getUsers = asyncHandler(async (req, res, next) => {
  const reqQuery = req.query;

  const user = await User.find().populate("blogs");
  res.status(200).json({
    success: true,
    data: user,
  });
});

//request GET
//@route /api/user/:userId
//access PRIVATE
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({ path: "blogs" });

  if (!user) {
    return next(new errorHandler(`User Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//request POST
//@route /api/user
//access PRIVATE
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    data: user,
  });
});

//request PUT
//@route /api/user/:userId
//access PRIVATE
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!user) {
    return next(new errorHandler(`User Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//request DELETE
//@route /api/user/:userId
//access PRIVATE
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new errorHandler(`User Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
