const rescue = require('express-rescue');
const joiSchema = require('../middlewares/errorJoi');
const loginService = require('../services/loginService');

const login = rescue(async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = await joiSchema.loginSchema.validate({ email, password });

  if (error) return next({ error: 'Campos inválidos', code: 'bad_request' });

  const userResponse = await loginService.getUser(email, password);

  if (userResponse.error) return next(userResponse);

  return res.status(200).json({ token: userResponse.token });
});

module.exports = {
  login,
};
