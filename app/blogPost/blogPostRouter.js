const express = require('express');

const rescue = require('express-rescue');

const blogPostController = require('./blogPostController');

const {
  joiSchemas: { blogPostSchema },
} = require('../utils');

const { auth, validate } = require('../../middlewares');

const router = express.Router();

function blogPostRouter(dependencies) {
  router
    .route('/')
    .get(auth, rescue(blogPostController.list(dependencies)))
    .post(auth, validate(blogPostSchema), rescue(blogPostController.create(dependencies)));

  router.route('/search').get(auth, rescue(blogPostController.search(dependencies)));

  router
    .route('/:id')
    .get(auth, rescue(blogPostController.find(dependencies)))
    .put(auth, rescue(blogPostController.update(dependencies)))
    .delete(auth, rescue(blogPostController.remove(dependencies)));

  return router;
}

module.exports = blogPostRouter;
