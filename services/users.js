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
    console.log('err:', err);
  }
};

module.exports = {
  createUser,
  loginUser,
};
