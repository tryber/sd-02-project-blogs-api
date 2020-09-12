const express = require('express');
const rescue = require('express-rescue');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router
  .post('/', rescue(userController.register))
  .get('/:id', authMiddleware, rescue(userController.getById))
  .get('/', authMiddleware, rescue(userController.getAll))
  .delete('/me', authMiddleware, rescue(userController.deleteMe));

module.exports = router;
