const blog = require("../model/blog");


exports.createBlog = async function (req, res, next) {
  try {
    const blogBody = req.body;
    blogBody.author = req.user._id
    const blogReadingTime = function () {
      const blogLenght =
        blogBody.body.split(" ").length +
        blogBody.title.split(" ").length +
        blogBody.description.split(" ").length;
      // console.log(blogLenght);
      const totalReadingtime = blogLenght / 200;
      return `${totalReadingtime} minute read`;
    };
    blogBody.reading_time = blogReadingTime();
    const newBlog = await blog.create({ ...req.body});
    return res.status(201).json({
      status: "success",
      messsge: "A new blog has been created",
      newBlog,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllBlogs = async function (req, res, next) {
  try {
    const filterBlog = { state: "published" };
    const queryObj = { ...req.query };
    let blogQuery = blog.find(filterBlog);


    //sorting read_count, reading_time and timestamp
    if (req.query.sort) {
      const searchBy = req.query.sort.split(",").join(" ");
      blogQuery = blogQuery.sort(searchBy);
    } else {
      blogQuery.sort({ timestamp: -1 });
    }

    //pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    blogQuery.skip(skip).limit(limit);

    const Blogs = await blogQuery;
    res.status(200).json({ status: "success", blogList: Blogs.length, Blogs });
  } catch (error) {
    next(error);
  }
};
exports.ownerBlog = async function (req, res, next) {
  try {
    const filterBlog = { state: "published" };
    const queryObj = { ...req.query };
    let blogQuery = blog.find(filterBlog);

    const Blog = await blog.find({ author: req.user._id });
    if (!Blog) {
      return new Error("you don't have access to this blog");
    }
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    blogQuery.skip(skip).limit(limit);

    return res
      .status(200)
      .json({ status: "success", result: Blog.length, Blog });
  } catch (error) {
    next(error);
  }
};
exports.getBlogById = async function (req, res, next) {
  try {
    const {blogId} = req.query;
    let Blog = await blog.findById(blogId).populate("author");
    if (!Blog) {
      res.status(404);
      const error = new Error("No blog found with that ID");
      return next(error);
    }
    Blog.read_count += 1;
    await Blog.save({ validateBeforeSave: true });

    res.status(200).json({ status: "success", blogList: Blog.length, Blog });
  } catch (error) {
    next(error);
  }
};
exports.updateBlog = async function (req, res, next) {
  try {
    const blogId= req.params.blogId;
    const state = req.body;

    // console.log("book");
    // const parsedBlog = await blog.findById(blogId);
    // console.log(parsedBlog);
    // if (!parsedBlog) {
    //   return next(new Error("this is not your blog"));
    // }
    // console.log(parsedBlog.author, req.user._id);
    // if (parsedBlog.author.toString() !== req.user._id) {
    //   return next(new Error("you are not authorized to upadate blog "));
    // }

    const newBlog = await blog.findByIdAndUpdate(blogId, state, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ status: "success", newBlog });
  } catch (error) {
    next(error);
  }
};

exports.deleteblog = async function (req, res, next) {
  try {
    const blogId = req.params.blogId;
    const blogToBeDeleted = await blog.findById(blogId);
    if (!blogToBeDeleted) {
      return next(new Error("You don't have any blog to be deleted"));
    }
    if (blogToBeDeleted.author.toString() !== req.user.id) {
      return next(new Error("you are not authorized to delete blog "));
    }
    const Blog = await blog.findByIdAndDelete(blogId);
    if (!Blog) {
      res.status(404);
      const error = new Error("No blog found with that ID");
      return next(error);
    }
    return res.status(204).json({ messsge: "deletion succesful" });
  } catch (error) {
    next(error);
  }
};

exports.publishBlog = async (req, res, next) => {
  try {
    // Uncomment this section if needed
    // if (!req.user.active === true) {
    //   return next(new Error('You are not authorized. Kindly sign up or login'));
    // }

    const blogId = req.params.blogId;
    const publishBlog = await blog.findById(blogId);

    if (!publishBlog) {
      return res.status(404).json({
        error: 'Blog not found',
      });
    }

    if (publishBlog.author === req.user._id) {
      publishBlog.state = "published";
      await publishBlog.save();

      return res.status(200).json({
        result: 'SUCCESS',
        message: 'Blog has been published successfully',
        publishBlog,
      });
    } else {
      return res.status(403).json({
        error: 'You are not authorized to publish this blog',
      });
    }
  } catch (error) {
    next(error);
  }
};


