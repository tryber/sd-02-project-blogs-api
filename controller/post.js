const { Blog_post, User } = require('../models');
const Joi = require('../services/Joi');
const { Op } = require('sequelize');
const paramExist = require('../services/paramExist');


const insert = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.dataValues.id;

  if (!paramExist(title, content)) {
    return res.status(400).json({ message: 'title, content devem ser passados' });
  }

  await Joi.blog_post.validateAsync({ content, title });

  const post = await Blog_post.create({ title, content, userId });

  res.status(201).json(post);
};

const findAll = async (_req, res) => {
  const posts = await Blog_post.findAll();

  res.status(200).json(posts);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const { content, title } = req.body;
  const userId = req.user.dataValues.id;

  if (!paramExist(title, content)) {
    return res.status(400).json({ message: 'title, content devem ser passados' });
  }

  await Joi.blog_post.validateAsync({ content, title });

  const user = await Blog_post.findOne({ where: { id } });

  if (user.dataValues.userId !== userId) {
    return res.status(403).json({ message: 'usuário sem permissão permissão' });
  }

  await Blog_post.update({ content, title }, { where: { id } });

  res.status(200).json({ message: 'atualizado com sucesso' });
};

const findById = async (req, res) => {
  const { id } = req.params;

  const post = await Blog_post.findByPk(id, {
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post não encontrado' });
  }

  res.status(200).json(post);
};

const search = async (req, res) => {
  const { q } = req.query;

  const posts = await Blog_post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
      ],
    },
  });

  res.status(200).json(posts);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.dataValues.id;

  const user = await Blog_post.findOne({ where: { id } });

  if (user.dataValues.userId !== userId) {
    return res.status(403).json({ message: 'usuário sem permissão permissão' });
  }

  await Blog_post.destroy({ where: { id } });

  res.status(200).json({ message: 'deletado com sucesso' });
};

module.exports = {
  insert,
  findAll,
  updateById,
  findById,
  search,
  deletePost,
};
