const express = require('express');
const postsController = require('../controllers/postsController');
const authenticatorController = require('../controllers/authenticatorController');

const router = express.Router();

router
  .route('/')
  .post(authenticatorController.authUser, postsController.postPost);

router
  .route('/')
  .get(postsController.getAllPosts);

router
  .route('/:id')
  .get(postsController.getPost);

router
  .route('/:id')
  .put(authenticatorController.authUser, postsController.updatePost);

router
  .route('/:id')
  .delete(authenticatorController.authUser, postsController.deletePost);

module.exports = router;
