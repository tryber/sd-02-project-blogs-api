const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

// No dotenv
const jwtSecret = 'trybe';

const findByEmail = async (email) => Users.findOne({ where: { email } });

const postUser = async ({ displayName, email, password, image }) => {
  const data = await findByEmail(email);
  if (data) return;
  await Users.create({ displayName, email, password, image });
  const token = jwt.sign({ data: { displayName, email } }, jwtSecret, jwtConfig);
  return { token };
};

module.exports = {
  postUser,
}