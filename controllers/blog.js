const asyncHandler = require("../middlewares/async");
const errorHandler = require("../utils/errorHandler");
const Blog = require("../models/Blog");
const User = require("../models/User");

//request GET
//@route /api/blog
//access PRIVATE
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const blog = await Blog.find();
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
    return next(new errorHandler(`blog Not Found`, 404));
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});

//request GET
//@route /api/:userId/blogs
//access PUBLIC
exports.getUsersBlog = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({ user: req.user.id });

  if (!blogs) {
    return next(new errorHandler(`Blogs Not Found`, 404));
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
  const blog = await Blog.findById(req.params.id);

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

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

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
