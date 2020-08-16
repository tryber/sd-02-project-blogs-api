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
} = require('./postController');

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  createPost,
  getAllPosts,
};
