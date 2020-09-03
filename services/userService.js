const jwt = require('jsonwebtoken');
const { User } = require('../models');

const { jwtSecret } = process.env;

const jwtConfig = {
  expiresIn: '300m',
  algorithm: 'HS256',
};

const loginUser = async (email, password) => {
  const result = await User.findOne({ where: { email } });
  if (result === null || result.password !== password) {
    return { error: true, message: 'Campos inválidos', code: 'bad_request' };
  }
  const { dataValues: { password: _, ...userWithoutPassword } } = result;
  const token = jwt.sign(userWithoutPassword, jwtSecret, jwtConfig);
  return { token };
};

const createUser = async ({ displayName, email, password, image = null }) => {
  const userExists = await User.findOne({ where: { email } });
  if (userExists !== null) {
    return { error: true, message: 'Usuário já existe', code: 'already_exists' };
  }
  await User.create({ displayName, email, password, image });
  return { email, password };
};

const getAllUsers = async () => User.findAll({ attributes: { exclude: ['password'] } });

const getUserById = async (id) => {
  const result = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (result === null) {
    return { error: true, message: 'Usuário não existe', code: 'not_found' };
  }
  return result;
};

const deleteUserById = async (id) => User.destroy({ where: { id } });

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  loginUser,
};
