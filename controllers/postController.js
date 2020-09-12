const { BlogPost, User } = require('../models');

const create = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user;

  if (!title || !content) {
    return res.status(400).json({ message: 'Campos inválidos' });
  }

  await BlogPost.create({
    title,
    content,
    user_id: id,
  });

  return res.status(201).json({ message: 'Novo post criado com sucesso' });
};

const getAll = async (_req, res) => {
  const blogPosts = await BlogPost.findAll({
    attributes: { exclude: ['user_id'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });

  return res.status(200).json(blogPosts);
};

module.exports = {
  create,
  getAll,
};
