const { Op } = require('sequelize');
const { BlogPosts, Users } = require('../models');

const bdError = { error: 'Erro no banco de dados', code: 'internal_error' };
const notUserError = { error: 'Operação não permitida', code: 'access_denied' };

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

const getPostsById = async (id) => {
  try {
    return await BlogPosts
      .findByPk(id, {
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

const validateUser = async (email) => {
  try {
    const { email: userEmail } = await Users.findOne({ where: { email } });
    if (userEmail !== email) return notUserError;
    return true;
  } catch (err) {
    throw bdError;
  }
};

const updateById = async (title, content, id) => {
  try {
    const post = await BlogPosts.findByPk(id);
    await post.update({
      title,
      content,
    });
  } catch (err) {
    throw bdError;
  }
};

const getPostBySearchTerm = async (searchTerm) => {
  try {
    return await BlogPosts.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: searchTerm,
            },
          },
          {
            content: {
              [Op.substring]: searchTerm,
            },
          },
        ],
      },
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

const deleteById = async (id) => {
  try {
    const deletedPost = await BlogPosts.destroy({ where: { id } });
    return deletedPost;
  } catch (err) {
    throw bdError;
  }
};

module.exports = {
  createBlogPost,
  getAllPosts,
  validateUser,
  updateById,
  getPostsById,
  getPostBySearchTerm,
  deleteById,
};
