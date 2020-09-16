const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

function tokenGenerator(userData) {
  const { id } = userData;
  const jwtConfig = {
    expiresIn: '50m',
    algorithm: 'HS256',
    subject: String(id),
  };

  return jwt.sign(userData, process.env.JWT_SECRET, jwtConfig);
}

async function create({ displayName, email, password, image }) {
  const registeredUser = await User.findAll({
    where: {
      email,
    },
  });

  if (registeredUser.length) return { error: true, code: 409, message: 'Usuário já existe' };

  const user = await User.create({ displayName, email, password, image });

  const { password: _, ...userInfo } = user.dataValues;

  const token = tokenGenerator(userInfo);

  return { token };
}

async function getAllUsers() {
  return User.findAll({
    attributes: { exclude: ['password'] },
  });
}

async function getUser(id) {
  const user = await User.findAll({
    attributes: { exclude: ['password'] },
    where: {
      id,
    },
  });

  return user[0];
}

async function deleteUser(id) {
  return User.destroy({ where: { id } });
}

async function login({ email, password }) {
  const user = await User.findAll({
    where: {
      email,
    },
  });

  if (!user[0] || user[0].dataValues.password !== password) {
    return { error: true, code: 400, message: 'Senha ou usuário incorretos, tente novamente' };
  }

  const { password: _, ...userData } = user[0].dataValues;

  const token = tokenGenerator(userData);

  return { token };
}

module.exports = {
  create,
  getAllUsers,
  getUser,
  deleteUser,
  login,
};
