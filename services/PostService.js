const { User, BlogPosts } = require('../models');

const newPost = async (id, title, content) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  if (!user) {
    const error = { error: { message: 'Usuário não existe', code: 'Invalid_data' } };
    throw error;
  }
  const modelAnswer = await user.createPost({
    title,
    content,
  });
  return modelAnswer;
};

const getAllPosts = async () => {
  const posts = await BlogPosts.findAll({
    // linhas 19 e 20 com ajuda do John
    attributes: { exclude: ['userId'] },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
  });
  return posts;
};

module.exports = {
  newPost,
  getAllPosts,
};
