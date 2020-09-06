const express = require('express');

const rescue = require('express-rescue');

const userController = require('./userController');

const {
  joiSchemas: {
    userSchema: { loginSchema, registerSchema, updateSchema },
  },
} = require('../../utils');

const { auth, validate, upload } = require('../../middlewares');

const router = express.Router();

function userRouter({ upload, ...dependencies }) {
  router
    .route('/')
    .get(auth, rescue(userController.list(dependencies)))
    .post(validate(registerSchema), rescue(userController.create(dependencies)));

  router.route('/login').post(validate(loginSchema), rescue(userController.login(dependencies)));

  router
    .route('/:id')
    .get(auth, rescue(userController.find(dependencies)))
    .patch(auth, validate(updateSchema), rescue(userController.update(dependencies)))
    .delete(auth, rescue(userController.remove(dependencies)));

  router
    .route('/image')
    .patch(
      upload({ dest: 'images/', field: 'image' }),
      rescue(userController.update(dependencies)),
    );

  return router;
}

module.exports = userRouter;
