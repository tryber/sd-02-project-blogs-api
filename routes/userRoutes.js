const express = require('express');
const { user } = require('../controllers');
const { tokenValidation } = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(tokenValidation, user.getAllUsers);

router
  .route('/')
  .post(user.createUser);

router
  .route('/me')
  .delete(tokenValidation, user.deleteUser);

router
  .route('/:id')
  .get(tokenValidation, user.getUserById);

module.exports = router;
