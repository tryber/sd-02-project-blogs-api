require('dotenv').config();
const JWT = require('jsonwebtoken');

const newToken = (data) =>
  JWT.sign(
    data,
    process.env.SECRET,
    {
      expiresIn: '300m',
      algorithm: 'HS256',
    },
  );

module.exports = {
  newToken,
};
