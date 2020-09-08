const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const JWT_CONFIG = {
  expiresIn: '30d',
  algorithm: 'HS256',
};

const generateToken = (JWT_PAYLOAD) => jwt.sign(JWT_PAYLOAD, JWT_SECRET, JWT_CONFIG);

module.exports = {
  generateToken,
};
