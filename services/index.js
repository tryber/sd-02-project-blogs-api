const { UserSchema, PostSchema } = require('./SchemaJoi');
const { userLogin, getAllUsers } = require('./userServices');

module.exports = {
  UserSchema,
  PostSchema,
  userLogin,
  getAllUsers,
};
