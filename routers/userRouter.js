const express = require('express');
const rescue = require('express-rescue');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router
  .post('/', rescue(userController.register))
  .get('/', authMiddleware, rescue(userController.getAll))
  .get('/:id', authMiddleware, rescue(userController.getById));

module.exports = router;
