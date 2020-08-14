const jwt = require('jsonwebtoken');

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

// No dotenv
const jwtSecret = 'trybe';

const createToken = (data) => jwt.sign({ data }, jwtSecret, jwtConfig);

const verifyToken = (token) => jwt.verify(token, jwtSecret).data;

module.exports = {
  createToken,
  verifyToken,
};
