const { Post, User } = require('../models');

const createPost = async ({ title, content }, userId) => {
  await Post.create({ title, content, userId });
  return { title, content, userId };
};

const getAllPosts = async () => Post.findAll(
  { attributes: { exclude: ['userId'] }, include: [{ model: User, as: 'user' }] },
);

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
    include: [{ model: User, as: 'user' }],
  });
  if (!result) return { error: true, message: 'Post não existe', code: 'not_found' };
  return result;
};

module.exports = {
  createPost,
  getAllPosts,
  updatePostById,
  getPostById,
};
