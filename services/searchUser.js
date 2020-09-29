const Models = require('../models');

const searchUser = async (email) =>
  Models.Users.findOne({ where: { email } });

module.exports = {
  searchUser,
};
