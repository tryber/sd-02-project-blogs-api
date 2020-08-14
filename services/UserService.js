const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

async function create({ displayName, email, password, image }) {
  const registeredUser = await User.findAll({
    where: {
      email,
    },
  });

  if (registeredUser.length) return { error: true, code: 409, message: 'Usuário já existe' };

  const user = await User.create({ displayName, email, password, image });

  const { password: _, ...userInfo } = user.dataValues;

  const jwtConfig = {
    expiresIn: '2h',
    algorithm: 'HS256',
  };

  const token = jwt.sign({ data: userInfo }, process.env.JWT_SECRET, jwtConfig);

  return { token };
}

module.exports = {
  create,
};
