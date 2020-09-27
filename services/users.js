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
  if (userCheck.password !== password) { return 401; }
  const { password: userPassword, ...restUser } = userCheck;
  const token = jwt.sign({ data: restUser }, JWT_SECRET, jwtConfig);
  return token;
};

const createUser = async ({ displayName, email, password, image }) => {
  try {
    const userCheck = await User.findOne({ where: { email } });
    if (userCheck) { return 409; }
    await User.create({ displayName, email, password, image });
    return { email, password };
  } catch (err) {
    console.log('error from service:', err);
  }
};

const list = async () => User.findAll();

const listOne = async (id) => {
  try {
    const findUser = await User.findOne({ where: { id } });
    if (!findUser) { return 404; }
    return findUser;
  } catch (err) {
    console.log('error from service:', err);
  }
};

const deleteUser = async (id) => {
  try {
    await User.destroy({ where: { id } });
  } catch (err) {
    console.log('error from service:', err);
  }
};

module.exports = {
  createUser,
  loginUser,
  list,
  listOne,
  deleteUser,
};
