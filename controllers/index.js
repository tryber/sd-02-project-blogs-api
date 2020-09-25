const user = require('./userController');
const login = require('./loginController');
const blogPost = require('./blogPostsController');
const errorController = require('./errorController');

module.exports = {
  blogPost,
  login,
  user,
  errorController,
};
