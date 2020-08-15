const express = require('express');
const rescue = require('express-rescue');
const validateJoi = require('../middlewares/validateJoi');
const { schemaNewUser } = require('../middlewares/schemasJoi');

const UserService = require('../services/UserService');

const user = express.Router();

user.get('/', rescue(async (req, res) => {
  const serviceAnswer = await UserService.getAllUsers();
  res.status(200).json(serviceAnswer);
}));

user.post('/', rescue(async (req, res) => {
  await validateJoi(schemaNewUser, req.body);
  const { displayName, email, password, image = '' } = req.body;
  const serviceAnswer = await UserService.newUser({ displayName, email, password, image });
  res.status(201).json({ token: serviceAnswer });
}));

module.exports = user;
