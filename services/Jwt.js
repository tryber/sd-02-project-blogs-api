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

const verifyToken = (token) =>
  JWT.verify(token, process.env.SECRET, (err, data) => {
    if (err) return err;
    return data;
  });

module.exports = {
  newToken,
  verifyToken,
};
