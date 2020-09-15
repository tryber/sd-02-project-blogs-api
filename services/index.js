const { UserSchema, PostSchema } = require('./SchemaJoi');
const { newToken } = require('./Jwt');

module.exports = {
  UserSchema,
  PostSchema,
  newToken,
};
