const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const wrapAsync = require("../../middlewares/wrapAsync");
const ErrorResponse = require("../../utils/errorResponse");
// const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

//login controller
//route: /api/v1/users/login
const login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await User.login(email, password);
  const token = createToken(user._id);
  res.user = user;
  res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // maxAge is in milliseconds
  res.status(200).json({
    message: 'logged in succesfully',
    user: user._id,
    token: token
  });
});

//signup controller
//route: /api/v1/users/signup
const signup = wrapAsync(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const user = await User.create({ first_name, last_name, email, password });
  const token = createToken(user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: 60 * 60  * 1000 }); // maxAge is in milliseconds
  res.status(201).json({ user });
});

//logout controller
//route: /api/v1/users/logout
const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); //maxAge is in milliseconds
  res.status(200).json({ message: "logged out" });
};

//delete user controller
//route: /api/v1/users/delete/:id
const deleteUser = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  user.posts.forEach(async (post) => {
    await Post.findByIdAndDelete(post._id);
  });
  await User.findByIdAndDelete(id);
  res.status(200).json({ message: "user deleted" });
});

//exports
module.exports = {
  login,
  signup,
  logout,
  deleteUser,
};

