const { UserSchema, PostSchema, LoginSchema } = require('./SchemaJoi');

const {
  createBlogPosts,
  getAllPosts,
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
  loginUser,
  editPost,
  getPost,
  getUser,
};
