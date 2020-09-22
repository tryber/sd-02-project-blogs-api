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

module.exports = router;
