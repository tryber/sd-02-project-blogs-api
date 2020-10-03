const { UserSchema, PostSchema } = require('./SchemaJoi');
const { userLogin, getAllUsers, getUser } = require('./userServices');

module.exports = {
  UserSchema,
  PostSchema,
  userLogin,
  getAllUsers,
  getUser,
};
