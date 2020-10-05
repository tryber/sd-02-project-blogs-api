const { UserSchema, PostSchema, LoginSchema } = require('./SchemaJoi');
const { createUser, getAllUsers, getUser, deleteUser, loginUser } = require('./userServices');

module.exports = {
  getAllUsers,
  LoginSchema,
  PostSchema,
  UserSchema,
  createUser,
  deleteUser,
  loginUser,
  getUser,
};
