const { UserSchema, PostSchema } = require('./SchemaJoi');
const { userLogin, getAllUsers, getUser, deleteUser } = require('./userServices');

module.exports = {
  UserSchema,
  PostSchema,
  userLogin,
  getAllUsers,
  getUser,
  deleteUser,
};
