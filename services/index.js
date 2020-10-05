const { UserSchema, PostSchema, LoginSchema } = require('./SchemaJoi');

const {
  createBlogPosts,
  getAllPosts,
  searchPost,
  editPost,
  getPost,
} = require('./blogServices');

const {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  loginUser,
} = require('./userServices');

module.exports = {
  createBlogPosts,
  getAllUsers,
  getAllPosts,
  LoginSchema,
  PostSchema,
  UserSchema,
  createUser,
  deleteUser,
  searchPost,
  loginUser,
  editPost,
  getPost,
  getUser,
};
