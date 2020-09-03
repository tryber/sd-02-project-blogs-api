const rescue = require('express-rescue');
const userService = require('../services/userService');
const schemasJoi = require('./schemasJoi');
const validateJoi = require('./validateJoi');

const loginUser = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.loginUser, req.body);
  if (isValid.error) return next(isValid);

  const { email, password } = req.body;

  const serviceAnswer = await userService.loginUser(email, password);
  if (serviceAnswer.error) return next(serviceAnswer);

  res.status(200).json(serviceAnswer);
});

const createUser = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.createUser, req.body);
  if (isValid.error) return next(isValid);

  const userInfo = { ...req.body };

  const serviceCreateAnswer = await userService.createUser(userInfo);
  if (serviceCreateAnswer.error) return next(serviceCreateAnswer);

  const { email, password } = serviceCreateAnswer;

  const serviceLoginAnswer = await userService.loginUser(email, password);

  return res.status(201).json(serviceLoginAnswer);
});

const getAllUsers = rescue(async (_req, res) => {
  const serviceAnswer = await userService.getAllUsers();
  return res.status(200).json(serviceAnswer);
});

const getUserById = rescue(async (req, res, next) => {
  const { id } = req.params;

  const serviceAnswer = await userService.getUserById(id);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

const deleteUserById = rescue(async (req, res) => {
  const { id } = req.user;

  await userService.deleteUserById(id);

  return res.status(204).end();
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  loginUser,
};
