const express = require('express');
const rescue = require('express-rescue');
const { users } = require('../services');
const { notFound, badData, exists, unauthorized } = require('../middlewares/error');
const { auth } = require('../middlewares/auth');

const router = express.Router();

const checkIntegrity = (displayName, email, password) => {
  return typeof displayName === 'string' && displayName.length !== 0 && typeof email === 'string' && email.length !== 0 && typeof password === 'string' && password.length !== 0;
};

const createUser = rescue(async (req, res, _next) => {
  console.log(req.body);
  const { displayName, email, password, image } = req.body;
  if (!checkIntegrity(displayName, email, password)) { throw badData; }
  const newUser = await users.createUser({ displayName, email, password });
  if (newUser === 409) { throw exists; }
  return res.status(201).json(newUser);
});

const loginUser = rescue(async (req, res) => {
  const { email, password } = req.body;
  const serviceAnswer = await users.loginUser({ email, password });
  if (serviceAnswer === 404) { throw notFound; }
  if (serviceAnswer === 401) { throw unauthorized; }
  res.status(200).json({ token: serviceAnswer });
});

module.exports = {
  createUser,
  loginUser,
};
