const rescue = require('express-rescue');
const joiSchema = require('../middlewares/errorJoi');
const userService = require('../services/userService');

const createUser = rescue(async (req, res, next) => {
  const { displayName, email, password, image = null } = req.body;

  const { error, value } = await joiSchema.schema.validate({ displayName, email, password, image });

  if (error) return next({ error: 'Campos inválidos', code: 'bad_request' });

  const userResponse = await userService.findOneAndCreated(email, value);

  if (userResponse.error) return next(userResponse);

  return res.status(200).json({ token: userResponse.token });
});

const getAllUsers = rescue(async (_req, res) => {
  const allUsers = await userService.getAllUsers();
  return res.status(200).json(allUsers);
});

const deleteUser = rescue(async (req, res) => {
  const { email } = req.user;
  await userService.deleteUser(email);
  return res.status(200).end();
});

const getUserById = rescue(async (req, res, next) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  if (user.error) return next(user);

  return res.status(200).json(user);
});

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  getUserById,
};
