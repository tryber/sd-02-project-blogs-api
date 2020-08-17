const { Op } = require('sequelize');
const { Post, User } = require('../models');

const createPost = async ({ title, content }, userId) => {
  await Post.create({ title, content, userId });
  return { title, content, userId };
};

const getAllPosts = async () => Post.findAll({
  attributes: { exclude: ['userId'] },
  include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
});

const updatePostById = async ({ title, content }, postId, userId) => {
  const isAuthor = await Post.findOne({ where: { id: postId, userId } });
  if (!isAuthor) {
    return { error: true, message: 'Usuário não autorizado', code: 'unauthorized' };
  }
  await Post.update(
    { title, content },
    { where: { id: postId } },
  );
  return { title, content, userId };
};

const getPostById = async (id) => {
  const result = await Post.findOne({
    where: { id },
    attributes: { exclude: ['userId'] },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
  });
  if (!result) return { error: true, message: 'Post não existe', code: 'not_found' };
  return result;
};

const getPostByQuery = async (query) => {
  const result = await Post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } }, { content: { [Op.like]: `%${query}%` } },
      ],
    },
    attributes: { exclude: ['userId'] },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
  });
  if (!result) return [];
  return result;
};

const deletePostById = async (postId, userId) => {
  const postExists = await Post.findOne({ where: { id: postId } });
  if (!postExists) {
    return { error: true, message: 'Post não existe', code: 'not_found' };
  }
  if (postExists.dataValues.userId !== userId) {
    return { error: true, message: 'Usuário não autorizado', code: 'unauthorized' };
  }
  await Post.destroy({ where: { id: postId } });
  return { postId, userId };
};

module.exports = {
  createPost,
  getAllPosts,
  updatePostById,
  getPostById,
  getPostByQuery,
  deletePostById,
};
