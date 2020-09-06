const models = require('../../database/models');

const UserRepository = require('./userRepository');

function userMapper({ id, ...data }) {
  return new UserRepository({
    models,
    data,
    id,
  });
}

module.exports = userMapper;
