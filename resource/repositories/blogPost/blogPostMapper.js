const models = require('../../database/models');

const BlogPostsRepository = require('./blogPostRepository');

function userMapper(data) {
  return new BlogPostsRepository({
    models,
    data,
  });
}

module.exports = userMapper;
