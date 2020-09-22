const { Post } = require('../models');

async function create({ title, content, userId }) {
  const post = await Post.create({ title, content, user_id: userId });

  return { post };
}

module.exports = {
  create,
};
