const { Op } = require('sequelize');
const { Post, User } = require('../models');

const createPost = async ({ title, content, userId }) => {
  try {
    await Post.create({ title, content, userId });
    return { title, content };
  } catch (err) {
    console.log('error from service:', err);
  }
};

const listPosts = async () => {
  const posts = await Post.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });

  return posts;
};

const updatePost = async ({ id, title, content, userId }) => {
  const { dataValues: { userId: authorPostId } } = await Post.findByPk(id);

  if (userId !== authorPostId) {
    return 403;
  }

  await Post.update(
    { title, content },
    { where: { id } },
  );
};

const listPost = async ({ id }) => {
  const post = await Post.findByPk(
    id,
    {
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
    },
  );
  if (!post) { return 404; }
  return post;
};

const searchPost = async ({ q }) => {
  try {
    const searchResults = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { content: { [Op.like]: `%${q}%` } },
        ],
      },
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
    });
    if (!searchResults) { return 404; }
    return searchResults;
  } catch (err) {
    console.log('error from service:', err);
  }
};

const deletePost = async ({ id, userId }) => {
  const { dataValues: { userId: authorPostId } } = await Post.findByPk(id);
  try {
    if (userId !== authorPostId) { return 403; }
    await Post.destroy({ where: { id } });
  } catch (err) {
    console.log('error from service:', err);
  }
};

module.exports = {
  createPost,
  listPosts,
  updatePost,
  listPost,
  searchPost,
  deletePost,
};
