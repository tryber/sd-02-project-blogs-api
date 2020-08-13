const { validate, userSchema } = require('../utils/validate');
const userService = require('../service/userService');

const objectError = {
  conflict: () => ({ message: 'Usuário já existe', code: 'conflict' }),
  invalid: (error) => ({ message: error.details[0].message || 'Campos Incorretos', code: 'invalid_data' }),
  internal: () => ({ message: 'Internal error', code: 'internal_error' }),
};

const postUser = async (req, res, next) => {
  const { password, email, image, displayName } = req.body;
  const { error } = await validate(userSchema, { email, displayName, password: JSON.stringify(password) }) || {};
  if (error) return next(objectError.invalid(error));
  const { token } = await userService.postUser({ password: JSON.stringify(password), email, image, displayName }) || false;
  if (!token) return next(objectError.conflict());
  return res.status(201).json({ token });
};

const getUsers = async (_req, res, _next) => {
  const data = await userService.getAllUsers() || [];
  return res.status(200).json(data.map(({ dataValues }) => dataValues))
}

module.exports = { postUser, getUsers };