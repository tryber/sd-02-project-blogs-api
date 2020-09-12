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

const update = async (req, res) => {
  const { title, content } = req.body;
  const { id: blogPostId } = req.params;
  const { id: userId } = req.user;

  if (!title || !content) {
    return res.status(400).json({ message: 'Campos inválidos' });
  }

  const { user_id: authorId } = await BlogPost.findByPk(blogPostId);

  if (userId !== authorId) {
    return res.status(403).json({ message: 'Operação não autorizada para este usuário' });
  }

  await BlogPost.update(
    { title, content },
    { where: { id: blogPostId } },
  );

  return res.status(200).json({ message: 'Post atualizado com sucesso' });
};

const getById = async (req, res) => {
  const { id } = req.params;

  const blogPost = await BlogPost.findByPk(id, {
    attributes: { exclude: ['user_id'] },
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
  });

  return res.status(200).json(blogPost);
};

module.exports = {
  create,
  getAll,
  update,
  getById,
};
