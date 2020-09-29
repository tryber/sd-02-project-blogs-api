const jwt = require('jsonwebtoken');

const { User } = require('../models');

const JWT_SECRET = 'mypassword123';

const jwtConfig = {
  expiresIn: '300m',
  algorithm: 'HS256',
};

const loginUser = async ({ email, password }) => {
  const userCheck = await User.findOne({ where: { email } });
  if (!userCheck) { return 404; }
  if (userCheck.password !== password) { return 400; }
  const { password: userPassword, ...restUser } = userCheck;
  const token = jwt.sign({ data: restUser }, JWT_SECRET, jwtConfig);
  return token;
};

const createUser = async ({ displayName, email, password, image }) => {
  const userCheck = await User.findOne({ where: { email } });
  if (userCheck) { return 409; }
  await User.create({ displayName, email, password, image });
  return { email, password };
};

const list = async () => User.findAll();

const listOne = async (id) => {
  const findUser = await User.findOne({ where: { id } });
  if (!findUser) { return 404; }
  return findUser;
};

const deleteUser = async (id) => {
  await User.destroy({ where: { id } });
};

module.exports = {
  createUser,
  loginUser,
  list,
  listOne,
  deleteUser,
};
