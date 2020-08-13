const jwt = require('jsonwebtoken');
const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

// No dotenv
const jwtSecret = 'trybe';


const createToken = (data) => jwt.sign({ data }, jwtSecret, jwtConfig);

module.exports = {
  createToken,
}