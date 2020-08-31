const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const jwtConfig = {
  expiresIn: '60m',
  algorithm: 'HS256',
};

module.exports = (user) => {
  const { password: _, ...userWithoutPassword } = user;

  const token = jwt.sign({ user: userWithoutPassword }, JWT_SECRET, jwtConfig);

  return token;
};
