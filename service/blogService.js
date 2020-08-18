const { BlogPosts } = require('../models');

const postInBlog = async (user, content) => BlogPosts.create({ ...content, user_id: user.id });

const getAllPosts = async () =>
  BlogPosts.findAll({ include: { all: true, attributes: { exclude: ['password'] } } });

const getOnePost = async (id) =>
  BlogPosts.findAll({
    where: { id },
    attributes: { exclude: ['user_id'] },
    include: { all: true, attributes: { exclude: ['password'] } },
  });

const putPost = async (id, title, content) =>
  BlogPosts.update({ title, content }, { where: { id } });

module.exports = {
  postInBlog,
  getAllPosts,
  getOnePost,
  putPost,
};
