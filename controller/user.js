const { validate, userSchema } = require('../utils/validate');
const userService = require('../service/userService');

const objectError = {
  conflict: () => ({ message: 'Usuário já existe', code: 'conflict' }),
  invalid: (error) => ({ message: error.details[0].message || 'Campos Incorretos', code: 'invalid_data' }),
};

const postUser = async (req, res, next) => {
  const { password, email, image, displayName } = req.body;
  const { error } = await validate(userSchema, { email, displayName, password: JSON.stringify(password) })|| false;
  if (error) next(objectError.invalid(error));
  const { token } = await userService.postUser({ password: JSON.stringify(password), email, image, displayName }) || false;
  if (!token) next(objectError.conflict());
  return res.status(201).json({ token });
};

module.exports = { postUser };