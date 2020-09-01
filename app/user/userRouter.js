const express = require('express');

const rescue = require('express-rescue');

const userController = require('./userController');

const {
  joiSchemas: { userSchema },
} = require('../utils');

const { auth, validate } = require('../../middlewares');

const router = express.Router();

function userRouter(dependencies) {
  router
    .route('/')
    .get(auth(dependencies.userModel), rescue(userController.list(dependencies)))
    .post(validate(userSchema.registerSchema), rescue(userController.create(dependencies)));

  router
    .route('/login')
    .get(validate(userSchema.loginSchema), rescue(userController.login(dependencies)));

  router
    .route('/:id')
    .get(auth(dependencies.userModel), rescue(userController.find(dependencies)))
    .put(auth(dependencies.userModel), rescue(userController.update(dependencies)))
    .delete(auth(dependencies.userModel), rescue(userController.remove(dependencies)));

  return router;
}

module.exports = userRouter;
