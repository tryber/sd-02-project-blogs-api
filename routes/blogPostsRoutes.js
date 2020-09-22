const express = require('express');
const { blogPost } = require('../controllers');
const { tokenValidation } = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(tokenValidation, blogPost.createBlogPost);

router
  .route('/')
  .get(blogPost.getAllPosts);

router
  .route('/search')
  .get(blogPost.getPostBySearchTerm);

router
  .route('/:id')
  .patch(tokenValidation, blogPost.updateById);

router
  .route('/:id')
  .get(blogPost.getPostById);

router
  .route('/:id')
  .delete(tokenValidation, blogPost.deletePostById);

module.exports = router;
