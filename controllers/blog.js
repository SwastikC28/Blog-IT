const asyncHandler = require("../middlewares/async");
const errorHandler = require("../utils/errorHandler");
const Blog = require("../models/Blog");
const User = require("../models/User");

//request GET
//@route /api/blog
//access PRIVATE
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blog = await Blog.find().populate({ path: "user" });

  res.status(200).json({
    success: true,
    count: blog.length,
    data: blog,
  });
});

//request GET
//@route /api/blog/:id
//access PRIVATE
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new errorHandler(`blog Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});

//request POST
//@route /api/user/:userId/blogs
//access PRIVATE
exports.createBlog = asyncHandler(async (req, res, next) => {
  req.body.user = req.params.userId;

  const user = await User.findById(req.body.user);

  if (!user) {
    return next(new errorHandler(`User does not exist`, 401));
  }

  const blog = await Blog.create(req.body);

  res.status(200).json({
    success: true,
    data: blog,
  });
});

//request PUT
//@route /api/blog/:id
//access PRIVATE
exports.updateBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!blog) {
    return next(new errorHandler(`blog Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});

//request DELETE
//@route /api/blog/:id
//access PRIVATE
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new errorHandler(`blog Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    message: "Blog Deleted Successfully",
  });
});
