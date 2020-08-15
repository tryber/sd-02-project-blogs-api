const express = require('express');
const userController = require('../controllers/usersController');
const authenticatorController = require('../controllers/authenticatorController');

const router = express.Router();

router
  .route('/')
  .get(authenticatorController.authUser, userController.getUsers);

router
  .route('/')
  .post(userController.postNewUser, authenticatorController.login);

router
  .route('/me')
  .delete(authenticatorController.authUser, userController.deleteUser);

router
  .route('/:id')
  .get(authenticatorController.authUser, userController.getUser);

module.exports = router;
