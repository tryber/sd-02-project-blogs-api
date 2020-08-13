// const express = require('express');
// const rescue = require('express-rescue');
// const { User } = require('../models');

// const users = express.Router();

// users.get('/', rescue(async (_req, res) => {
//   const result = await User.findAll();
//   return res.status(200).json(result);
// }));

// users.post('/', rescue(async (req, res) => {
//   const { displayName, email, password, image } = req.body;
//   const result = await User.create({ displayName, email, password, image });
//   return res.status(201).json(result);
// }));

// module.exports = users;
