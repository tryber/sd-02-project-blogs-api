const models = require('../../database/models');

const UserRepository = require('./userRepository');

function userMapper(data) {
  return new UserRepository({
    models,
    data,
  });
}

module.exports = userMapper;
