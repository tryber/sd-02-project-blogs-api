const express = require('express');
const middlewares = require('../middlewares/Auth');
const services = require('../services');

const router = express.Router();

router
  .post('/',
    middlewares.ValidUser,
    middlewares.PostValid,
    services.createBlogPosts);

router
  .get('/', services.getAllPosts);

router
  .get('/:id', services.getPost);

router
  .put('/:id',
    middlewares.ValidUser,
    middlewares.PostValid,
    services.editPost);

router
  .get('/search', services.searchPost);

router
  .delete('/:id',
    middlewares.ValidUser,
    services.deletePost);

module.exports = { router };
