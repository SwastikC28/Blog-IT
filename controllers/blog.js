const asyncHandler = require("../middlewares/async");
const errorHandler = require("../utils/errorHandler");
const Blog = require("../models/Blog");
const User = require("../models/User");

//request GET
//@route /api/blog or /api/:userId/blogs
//access PRIVATE
exports.getBlogs = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.userId) {
    query = Blog.find({ user: req.params.userId });
  } else {
    query = await Blog.find();
  }

  const blog = await query;
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
  const blog = await Blog.findById(req.params.id).populate({
    path: "user",
    select: "name email",
  });

  if (!blog) {
    return next(new errorHandler(`Blog Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});

//request POST
//@route /api/blog
//access PRIVATE
exports.createBlog = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

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
  let id = req.params.id;

  let blog = await Blog.findById(id);

  if (!blog) {
    return next(new errorHandler(`Blog Not Found`, 404));
  }

  // Check for Blog user's Ownership
  if (blog.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorHandler(
        `User ${req.user.id} is not authorized to update this blog`,
        403
      )
    );
  }

  let data = await Blog.findByIdAndUpdate(id, req.body);
  console.log("success");
  res.status(200).json({
    success: true,
    data: blog,
  });
});

//request DELETE
//@route /api/blog/:id
//access PRIVATE
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new errorHandler(`Blog Not Found`, 404));
  }

  // Check for Blog user's Ownership
  if (blog.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new errorHandler(
        `User ${req.user.id} is not authorized to delete this blog`,
        403
      )
    );
  }

  blog = await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Blog Deleted Successfully",
  });
});
