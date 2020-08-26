const { BlogPosts, Users } = require('../../database/models');

const BlogPostsRepository = require('./blogPostRepository');

function userMapper(data) {
  return new BlogPostsRepository({
    BlogPosts,
    Models: { Users },
    data,
  });
}

module.exports = userMapper;
