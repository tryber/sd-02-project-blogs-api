const Models = require('../models');
const { verifyToken } = require('./Jwt');
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

const getUser = async (req, res) => {
  const userById = await Models.Users.findByPk(req.params.id);

  if (userById) {
    return res.status(200).json({
      status: 'Success',
      user: userById,
    });
  }

  return res.status(404).json({
    message: 'User not exists',
    code: 'not_found',
  });
};

const deleteUser = async (req, res) => {
  const decryptedUser = verifyToken(req.headers.authorization);
  const dbUser = await Models.Users.findOne({ where: { email: decryptedUser.email } });

  await dbUser.destroy();

  return res.status(200).json({
    status: 'Success',
    message: `User ${decryptedUser.displayName} was deleted.`,
  });
};

module.exports = {
  getAllUsers,
  deleteUser,
  userLogin,
  getUser,
};
