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

module.exports = {
  create,
  getAllPosts,
};
