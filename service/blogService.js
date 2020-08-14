const { BlogPosts } = require('../models');

const postInBlog = async (user, content) => BlogPosts.create({ ...content, user_id: user.id });

const getAllPosts = async () => BlogPosts.findAll({ include: { all: true, attributes: { exclude: ['password'] } } });

module.exports = {
  postInBlog,
  getAllPosts,
};
