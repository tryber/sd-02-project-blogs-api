const { BlogPost, User } = require('../models');
const { Op } = require('sequelize');
const validate = require('../services/validate');


const insert = async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user.dataValues.id;

  try {
    await validate.post.insert(content, title);
  } catch (err) {
    return next(err);
  }

  const post = await BlogPost.create({ title, content, userId });

  res.status(201).json(post);
};

const findAll = async (_req, res) => {
  const posts = await BlogPost.findAll({
    attributes: { exclude: ['userId'] },
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
  });

  res.status(200).json(posts);
};

const updateById = async (req, res, next) => {
  const { id } = req.params;
  const { content, title } = req.body;
  const userId = req.user.dataValues.id;

  try {
    await validate.post.updateById({ content, title, id, userId });
  } catch (err) {
    return next(err);
  }

  await BlogPost.update({ content, title }, { where: { id } });

  res.status(200).json({ message: 'atualizado com sucesso' });
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  let post;

  try {
    post = await validate.post.findById(id);
  } catch (err) {
    return next(err);
  }

  res.status(200).json(post);
};

const search = async (req, res) => {
  const { q } = req.query;

  const posts = await BlogPost.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
      ],
    },
  });

  res.status(200).json(posts);
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.dataValues.id;

  try {
    await validate.post.deletePost({ id, userId });
  } catch (err) {
    return next(err);
  }

  await BlogPost.destroy({ where: { id } });

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
