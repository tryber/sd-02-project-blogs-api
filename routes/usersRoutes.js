const express = require('express');
const userController = require('../controllers/usersController');
const authenticatorController = require('../controllers/authenticatorController');

const router = express.Router();

router
  .route('/')
  .get(authenticatorController.authUser, userController.getUsers);

router
  .route('/:id')
  .get(authenticatorController.authUser, userController.getUser);

module.exports = router;
