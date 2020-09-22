const { BlogPosts, Users } = require('../models');

const bdError = { error: 'Erro no banco de dados', code: 'internal_error' };

const createBlogPost = async (title, content, email) => {
  try {
    const user = await Users.findOne({ where: { email } });
    await BlogPosts.create({ title, content, userId: user.id });
  } catch (err) {
    throw bdError;
  }
};

const getAllPosts = async () => {
  try {
    return await BlogPosts
      .findAll({
        attributes: { exclude: ['userId'] },
        include: {
          model: Users,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      });
  } catch (err) {
    throw bdError;
  }
};

module.exports = {
  createBlogPost,
  getAllPosts,
};
