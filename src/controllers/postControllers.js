const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const wrapAsync = require("../../middlewares/wrapAsync");
const ErrorResponse = require("../../utils/errorResponse");

//get all posts controller
//get all posts of a user controller
//route: /api/v1/posts
//route: /api/v1/users/:id/posts
const getAllPost = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const { state } = req.query;
  const { timestamp, reading_time, read_count } = req.query;
 

  //copy req.query
    const reqQuery = { ...req.query };
    
    //search by author, title, tag
   const { author, title, tag } = req.query;
  let select = {};
  if (id) {
    if (state) {
      select = { author: id, state: state };
    } else {
      select = { author: id };
    }
  } else {
      if (author){
       select.author = author 
      }
      else if (title) {
            select.title = title
      }
      else if (tag) {
            select.tags = tag
      }else{
          select = {}
      }
  }

  //fields to exclude
  const removeFields = ["limit", "page"];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //sort
  let timeStamp = {};
  let readTime = {};
  let readCount = {};

  if (timestamp === "asc") {
    timeStamp = { timestamp: 1 };
  } else if (timestamp === "desc") {
    timeStamp = { timestamp: -1 };
  } else {
    timeStamp = {};
  }
  
  if (read_count === "asc") {
    readCount = { read_count : 1 };
  } else if (read_count === "desc") {
    readCount = { read_count: -1 };
  } else {
    readCount = {};
  }

  if (reading_time === "asc") {
    readTime = { reading_time: 1 };
  } else if (reading_time === "desc") {
    readTime = { reading_time: -1 };
  } else {
    readTime = {};
  }

  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  let query = Post.find(select);

  query = query.skip(startIndex).limit(limit).sort(timeStamp).sort(readTime).sort(readCount);
  const posts = await query;

  //pagination result
  //shows the next and previous page and number of posts on each page
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    count: posts.length, //total number of posts
    pagination,
    data: posts,
  });
});

//get single post controller
//route: /api/v1/posts/:id
const getPost = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate({
    path: "author",
    select: "first_name last_name ",
  });
  post.read_count += 1;
  await post.save();
  res.status(200).json({ post });
});

//create post controller
//route: /api/v1/posts/create
const createPost = wrapAsync(async (req, res, next) => {
  const { title, description, body, tags } = req.body;
  const { id } = req.user;

  const user = await User.findById(id);
  const postAuthor = {
    first_name: user.first_name,
    last_name: user.last_name,
    _id: user._id,
  };
  const newPost = new Post({
    title,
    description,
    body,
    tags,
    author: postAuthor,
  });
  const post = await newPost.save();
  user.posts.push(post._id);
  await user.save();
  res.status(201).json({ post });
});

//update post controller
//route: /api/v1/posts/edit/:id
const updatePost = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { id } = req.params;
  const { title, description, body, tags } = req.body;
  const post = await Post.find({ _id: id });

  //check if post exists
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));  
  }

  //check if user is the author of the post
  if (post[0].author._id.toString() != user._id) {
    return next(new ErrorResponse("You are not authorized to perform this action", 401));
  }
  const newPost = await Post.findByIdAndUpdate(
    id,
    { title, description, body, tags },
    { new: true }
  );
  res.status(200).json({ newPost });
});

//delete post controller
//route: /api/v1/posts/delete/:id
const deletePost = wrapAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.user.id);
  const post = await Post.findById(id);

  //check if post exists
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  //check if user is the author of the post
  if (post.author._id.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized to delete this post", 401));
  }
  user.posts = user.posts.filter((post) => post._id.toString() !== id);
  await user.save();
  await post.remove();

  res.status(200).json({
    success: true,
    message: "post deleted successfully",
  });
});

//update state of post controller
//route: /api/v1/posts/state/:id
const updateState = wrapAsync(async (req, res, next) => {

  const user = await User.findById(req.user.id);
  const { id } = req.params;
  const { state } = req.body;
  const post = await Post.find({ _id: id });

  //check if post exists
  if (!post) {
    return next(new ErrorResponse("Post not found", 404));  
  }

  //check if user is the author of the post
  if (post[0].author._id.toString() != user._id) {
    return next(new ErrorResponse("You are not authorized to perform this action", 401));
  }
  post[0].state = state;
  await post[0].save();
  res.status(200).json({ post });
});

//module exports
module.exports = {
  getAllPost,
  getPost,
  createPost,
  updatePost,
  deletePost,
  updateState,
};
