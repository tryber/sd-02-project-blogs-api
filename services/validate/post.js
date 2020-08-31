const paramExist = require('../paramExist');
const Joi = require('../Joi');
const { BlogPost, User } = require('../../models');

const insert = async (title, content) => {
  if (!paramExist(title, content)) {
    return Promise.reject({ message: 'title, content devem ser passados', code: 400 });
  }

  await Joi.blogPost.validateAsync({ content, title });
};

const updateById = async ({ title, content, id, userId }) => {
  if (!paramExist(title, content)) {
    return Promise.reject({ message: 'title, content devem ser passados', code: 400 });
  }

  await Joi.blogPost.validateAsync({ content, title });

  const user = await BlogPost.findOne({ where: { id } });

  if (user.dataValues.userId !== userId) {
    return Promise.reject({ message: 'usuário sem permissão', code: 403 });
  }
};

const findById = async (id) => {
  const post = await BlogPost.findByPk(id, {
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });

  if (!post) {
    return Promise.reject({ message: 'Post não encontrado', code: 404 });
  }

  return post;
};

const deletePost = async ({ id, userId }) => {
  const user = await BlogPost.findOne({ where: { id } });

  if (user.dataValues.userId !== userId) {
    return Promise.reject({ message: 'usuário sem permissão', code: 403 });
  }
};

module.exports = {
  insert,
  updateById,
  findById,
  deletePost,
};
