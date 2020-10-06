const Sequelize = require('sequelize');
const { BlogPosts } = require('../models');

const { Op } = Sequelize;

const postInBlog = async (user, content) => BlogPosts.create({ ...content, user_id: user.id });

const getAllPosts = async () =>
  BlogPosts.findAll({ include: { all: true, attributes: { exclude: ['password'] } } });

const getOnePost = async (id) =>
  BlogPosts.findOne({
    where: { id },
    attributes: { exclude: ['user_id'] },
    include: { all: true, attributes: { exclude: ['password'] } },
  });

const putPost = async (id, title, content) =>
  BlogPosts.update({ title, content }, { where: { id } });

const findForText = async (searchTerm) =>
  BlogPosts.findAll({
    where: {
      [Op.or]: [{ title: { [Op.regexp]: searchTerm } }, { content: { [Op.regexp]: searchTerm } }],
    },
    attributes: { exclude: ['user_id'] },
    include: { all: true, attributes: { exclude: ['password'] } },
  });

const excludePost = async (id) => BlogPosts.destroy({ where: { id } });

module.exports = {
  postInBlog,
  getAllPosts,
  getOnePost,
  putPost,
  findForText,
  excludePost,
};
