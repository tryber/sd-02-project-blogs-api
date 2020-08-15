const jwt = require('jsonwebtoken');
const { User } = require('../models');

const jwtConfig = {
  expiresIn: '300m',
  algorithm: 'HS256',
};

const loginError = { code: 'unauthorized', message: 'Campos inválidos' };

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(loginError);
    const user = await User.findAll({ where: { email } });

    if (!user[0] || user[0].password !== password) {
      return next(loginError);
    }

    const { password: _, id: __, ...payload } = user[0];

    const token = jwt.sign(payload, 'segredo', jwtConfig);

    res.status(200);
    res.json({ token });
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const authUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next({ code: 'unauthorized', message: 'Missing JWT' });
  try {
    const payload = jwt.verify(token, 'segredo');

    const user = await User.findAll({ where: { email: payload.email } });

    if (!user[0]) return next({ code: 'not_found', message: 'User not found' });

    req.user = user;

    next();
  } catch (err) {
    next({ code: 'unauthorized', message: 'Invalid Token' });
  }
};

module.exports = {
  login,
  authUser,
};
