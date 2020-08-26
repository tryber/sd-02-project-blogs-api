const blogPostMapper = require('./blogPost/blogPostMapper');
const userMapper = require('./users/userMapper');

module.exports = {
  blogPostModel: blogPostMapper,
  userModel: userMapper,
};
