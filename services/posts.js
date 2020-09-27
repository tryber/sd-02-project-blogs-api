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
  const Posts = await Post.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });

  return Posts;
};

module.exports = {
  createPost,
  listPosts,
};

