const express = require('express');
const UserController = require('./UserController');
const JwT = require('../middlewares/JwT');

const userRoute = express.Router();

userRoute.post('/', UserController.newUser);
userRoute.get('/', JwT.loginJwt, UserController.getAllUsers);
userRoute.get('/:id', JwT.loginJwt, UserController.getUserById);

module.exports = userRoute;
