const express = require('express');
const rescue = require('express-rescue');
const { users } = require('../services');
const { notFound, badData, exists, unauthorized } = require('../middlewares/error');

const checkIntegrity = (displayName, email, password) => {
  const mailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  return typeof displayName === 'string' && displayName.length !== 0 && typeof email === 'string' && mailRegex.test(email) && typeof password === 'string' && password.length !== 0;
};

const createUser = async (req, res, _next) => {
  const { displayName, email, password, image = 'xablau.jpg' } = req.body;
  try {
    if (!checkIntegrity(displayName, email, password)) { throw badData; }
    const newUser = await users.createUser({ displayName, email, password, image });
    if (newUser === 409) { throw exists; }
    const serviceAnswer = await users.loginUser({ email, password });
    return res.status(201).json({ token: serviceAnswer });
  } catch (err) {
    console.log('error from controller.createUser:', err);
  }
};

const list = async (_req, res) => {
  try {
    const listUsers = await users.list();
    return res.status(200).json({ users: listUsers });
  } catch (err) {
    console.log('error from controller.list:', err);
  }
};

module.exports = {
  createUser,
  list,
  // loginUser,
  // loginUserController,
};
