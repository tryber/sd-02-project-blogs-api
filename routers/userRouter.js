const express = require('express');
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .post('/', userController.register)
  .get('/', authMiddleware, userController.getAll);

module.exports = router;
