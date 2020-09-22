const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const tokenValidation = async (req, _res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next({
      error: 'Token não encontrado ou não informado',
      code: 'unauthorized',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({ where: { email: payload.data.email } });

    if (!user) {
      return next({
        error: 'Erro ao procurar usuario/a do token',
        code: 'invalid_data',
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return next({
      error: 'Usuario/a não autorizado',
      code: 'unauthorized',
    });
  }
};

module.exports = {
  tokenValidation,
};
