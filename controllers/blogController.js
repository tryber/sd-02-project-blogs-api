const express = require('express');
const middlewares = require('../middlewares/Auth');
const services = require('../services');

const router = express.Router();

router
  .get('/search', services.searchPost);

router
  .post('/',
    middlewares.ValidUser,
    middlewares.PostValid,
    services.createBlogPosts);

router
  .get('/', services.getAllPosts);

router
  .put('/:id',
    middlewares.ValidUser,
    middlewares.PostValid,
    services.editPost);

router
  .get('/:id', services.getPost);

module.exports = { router };
