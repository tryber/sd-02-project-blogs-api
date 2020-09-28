const { Op } = require('sequelize');
const { Post } = require('../models');
const { User } = require('../models');

async function create({ title, content, userId }) {
  const post = await Post.create({ title, content, user_id: userId });

  return { post };
}

async function getAllPosts() {
  const posts = await Post.findAll({
    attributes: { exclude: ['user_id'] },
    include: { model: User, as: 'user' },
  });

  return posts;
}

async function updatePost({ title, content, postId, userId }) {
  const post = await Post.findOne({ where: { id: postId } });
  const { user_id: userIdFromPost } = post;

  if (userId !== userIdFromPost) {
    return { error: true, code: 403, message: 'Você só pode alterar seus próprios posts' };
  }

  return Post.update(
    { title, content },
    { where: { id: postId } },
  );
}

async function searchPosts({ searchTerm }) {
  const posts = await Post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${searchTerm}%` } },
        { content: { [Op.like]: `%${searchTerm}%` } },
      ],
    },
    attributes: { exclude: ['user_id'] },
    include: { model: User, as: 'user' },
  });

  return posts;
}

module.exports = {
  create,
  getAllPosts,
  updatePost,
  searchPosts,
};
