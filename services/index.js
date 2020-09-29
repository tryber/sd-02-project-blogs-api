const { UserSchema, PostSchema } = require('./SchemaJoi');
const { userLogin } = require('./userServices');

module.exports = {
  UserSchema,
  PostSchema,
  userLogin,
};
