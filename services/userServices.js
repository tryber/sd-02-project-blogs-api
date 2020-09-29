const Models = require('../models');
const { newToken } = require('./Jwt');

const searchUser = async (email) =>
  Models.Users.findOne({ where: { email } });

const userLogin = async (req, res) => {
  const isExistsUser = await searchUser(req.body.email);

  if (isExistsUser) {
    return res.status(409).json({
      message: 'Usuário já existe',
    });
  }

  await Models.Users.create({ ...req.body });

  return res.status(201).json({
    token: newToken(req.body),
  });
};

module.exports = {
  userLogin,
};
