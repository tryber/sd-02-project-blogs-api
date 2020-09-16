const jwt = require('jsonwebtoken');

const { User } = require('../models');

const JWT_SECRET = 'mypassword123';

const jwtConfig = {
  expiresIn: '300m',
  algorithm: 'HS256',
};

const find = async ({ email }) => User.find({ email });

const loginUser = async ({ email, password }) => {
  const checkEmail = await User.findByEmail(email);
  if (!checkEmail) { return 404; }
  if (checkEmail.password !== password) { return 401; }
  const { password: userPassword, ...otherData } = checkEmail;
  const token = jwt.sign({ data: otherData }, JWT_SECRET, jwtConfig);
  return token;
};

const createUser = async ({ name, email, password }) => {
  if (find(email)) { return 409; }
  await User.create({ name, email, password });
  return loginUser({ email, password });
};

module.exports = {
  createUser,
  loginUser,
};
