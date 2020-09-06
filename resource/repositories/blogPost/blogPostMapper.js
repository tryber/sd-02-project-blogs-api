const models = require('../../database/models');

const BlogPostsRepository = require('./blogPostRepository');

function userMapper({ id, ...data }) {
  return new BlogPostsRepository({
    models,
    data,
    id,
  });
}

module.exports = userMapper;
