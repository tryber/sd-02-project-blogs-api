const { Post, User } = require('../models');

const createPost = async ({ title, content }, userId) => {
  await Post.create({ title, content, userId });
  return { title, content, userId };
};

const getAllPosts = async () => Post.findAll(
  { attributes: { exclude: ['userId'] }, include: [{ model: User, as: 'user' }] },
);

module.exports = {
  createPost,
  getAllPosts,
};
