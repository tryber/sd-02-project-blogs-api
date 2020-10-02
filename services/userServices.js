const Models = require('../models');
const { newToken } = require('./Jwt');

const userLogin = async (req, res) => {
  const isExistsUser = await Models.Users.findOne({ where: { email: req.body.email } });

  if (!isExistsUser) {
    await Models.Users.create({ ...req.body });

    return res.status(201).json({
      token: newToken(req.body),
    });
  }

  return res.status(409).json({
    message: 'Usuário já existe',
  });
};

const getAllUsers = async (_req, res) => {
  const allUsers = await Models.Users.findAll();
  return res.status(200).json({
    status: 'Success',
    users: allUsers,
  });
};

module.exports = {
  userLogin,
  getAllUsers,
};
