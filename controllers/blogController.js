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

module.exports = { router };
