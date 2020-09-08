const express = require('express');
const rescue = require('express-rescue');
const authMiddleware = require('../middlewares/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .post('/', rescue(userController.register))
  .get('/', authMiddleware, rescue(userController.getAll));

module.exports = router;
