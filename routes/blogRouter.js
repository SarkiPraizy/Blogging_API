const express = require("express");
const passport = require("passport");
const blogValidation = require("../validators/blogValidators");
const blogController = require("../controller/blogController");
const { isAuthenticated } = require("../controller/authController");



const blogRouter = express.Router();

blogRouter.get("/getBlogs", blogController.getAllBlogs);
blogRouter.get(
  "/owner",
 isAuthenticated,
  blogController.ownerBlog
);
blogRouter.get("/blogId", blogController.getBlogById);

blogRouter.post(
  "/create",
 isAuthenticated,

  blogController.createBlog
);
blogRouter.patch(
  "/updateBlog/:blogId",
  isAuthenticated,
  blogController.updateBlog
);
blogRouter.delete(
  "/deleteBlog/:blogId",
  isAuthenticated,
  blogController.deleteblog
);

blogRouter.patch(
  "/publishBlog/:blogId", isAuthenticated, 
blogController.publishBlog);

module.exports = blogRouter;
