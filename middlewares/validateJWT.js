const jwt = require('jsonwebtoken');
const rescue = require('express-rescue');
const { User } = require('../models');

const { jwtSecret } = process.env;

const validateJWT = rescue(async (req, _res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next({ error: true, message: 'Token não encontrado', code: 'unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userExists = await User.findByPk(decoded.id);
    if (!userExists) {
      return next({ error: true, message: 'Usuário não encontrado', code: 'unauthorized' });
    }
    const { dataValues: { password: _, ...userWithoutPassword } } = userExists;

    req.user = userWithoutPassword;
    next();
  } catch (fail) {
    next({ error: true, message: 'Token expirado ou inválido', code: 'unauthorized' });
  }
});

module.exports = validateJWT;
