const { Users } = require('../../database/models');

const UserRepository = require('./userRepository');

function userMapper(data) {
  return new UserRepository({
    Users,
    Models: null,
    data,
  });
}

module.exports = userMapper;
