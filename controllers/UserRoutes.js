const express = require('express');
const UserController = require('./UserController');

const userRoute = express.Router();

userRoute.post('/', UserController.newUser);

userRoute.get('/', UserController.getAllUsers);

module.exports = userRoute;
