const express = require('express');
const rescue = require('express-rescue');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router
  .post('/', authMiddleware, rescue(postController.create))
  .get('/', authMiddleware, rescue(postController.getAll))
  .put('/:id', authMiddleware, rescue(postController.update));

module.exports = router;
