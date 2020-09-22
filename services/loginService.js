const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const jwtSecret = process.env.JWT_SECRET;

const jwtConfig = {
  expiresIn: '300m',
  algorithm: 'HS256',
};

const validateTokenUser = (user) => {
  const { dataValues: { id, password, ...userInfo } } = user;
  const token = jwt.sign({ data: userInfo }, jwtSecret, jwtConfig);
  return token;
};

const getUser = async (email, password) => {
  try {
    const user = await Users.findOne({ where: { email } });
    if (user.dataValues.password === password) return ({ token: await validateTokenUser(user) });
    return ({ error: 'Campos inválidos', code: 'bad_request' });
  } catch (err) {
    return ({ error: 'Erro no banco de dados', code: 'internal_error' });
  }
};

module.exports = {
  getUser,
};
