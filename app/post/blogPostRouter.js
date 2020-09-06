const express = require('express');

const rescue = require('express-rescue');

const postController = require('./blogPostController');

const {
  joiSchemas: { blogPostSchema },
} = require('../../utils');

const { auth, validate } = require('../../middlewares');

const router = express.Router();

function postRouter(dependencies) {
  router
    .route('/')
    .get(auth, rescue(postController.list(dependencies)))
    .post(auth, validate(blogPostSchema), rescue(postController.create(dependencies)));

  router.route('/search').get(auth, rescue(postController.search(dependencies)));

  router
    .route('/:id')
    .get(auth, rescue(postController.find(dependencies)))
    .put(auth, validate(blogPostSchema), rescue(postController.update(dependencies)))
    .delete(auth, rescue(postController.remove(dependencies)));

  return router;
}

module.exports = postRouter;
