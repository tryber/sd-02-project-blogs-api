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
    // linhas 21 e 22 com ajuda do John
    // no meu UserModel eu referencio uma foreignKey, com isso o include abaixo
    // sabe como referenciar cada usuário quando busco no BlogPosts
    attributes: { exclude: ['userId'] },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
  });
  if (!posts) {
    const error = { error: { message: 'Dados não encontrados', code: 'Not_found' } };
    throw error;
  }
  return posts;
};

module.exports = {
  newPost,
  getAllPosts,
};
