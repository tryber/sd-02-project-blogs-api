const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  loginUser,
} = require('./userController');

const {
  createPost,
  getAllPosts,
  updatePostById,
  getPostById,
  getPostByQuery,
  deletePostById,
} = require('./postController');

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  createPost,
  getAllPosts,
  updatePostById,
  getPostById,
  getPostByQuery,
  deletePostById,
};
