const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  loginUser,
} = require('./userController');

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
};
