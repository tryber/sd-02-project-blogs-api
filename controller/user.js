const { validate, userSchema } = require('../utils/validate');
const userService = require('../service/userService');

const objectError = {
  conflict: () => ({ message: 'Usuário já existe', code: 'conflict' }),
  invalid: (error) => ({ message: error ? error.details[0].message : 'Campos inválidos', code: 'invalid_data' }),
};

const postUser = async (req, res, next) => {
  const { password, email, image, displayName } = req.body;
  const { error } = await validate(userSchema, {
    email, displayName, password,
  });
  if (error) return next(objectError.invalid(error));
  const { token } = await userService.postUser({
    password: JSON.stringify(password), email, image, displayName,
  }) || false;
  if (!token) return next(objectError.conflict());
  return res.status(201).json({ token });
};

const getUsers = async (_req, res) => {
  const data = await userService.getAllUsers() || [];
  return res.status(200).json(data.map(({ dataValues }) => dataValues));
};

const getUser = async (req, res) => {
  const user = await userService.getOneUser(req.params.id);
  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  await userService.deleteOneUser(req.user.id);
  res.status(204).json();
};

const login = async (req, res, next) => {
  const token = await userService.login(req.body);
  if (!token) return next(objectError.invalid(false));
  return res.status(200).json({ token });
};

module.exports = { postUser, getUsers, getUser, deleteUser, login };
