const express = require('express');
const rescue = require('express-rescue');
const { User } = require('../models');

const user = express.Router();

user.get('/', rescue(async (req, res) => {
  User.findAll()
    .then((users) => res.status(200).json(users))
    .catch((e) => {
      const error = { error: { message: e.message, code: 'internal_error' } };
      throw error;
    });
}));

module.exports = user;
