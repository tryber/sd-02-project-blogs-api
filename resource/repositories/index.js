const blogPostMapper = require('./blogPost/blogPostMapper');
const userMapper = require('./user/userMapper');

module.exports = {
  blogPostModel: blogPostMapper,
  userModel: userMapper,
};
