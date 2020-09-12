const { BlogPost } = require('../models');

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

module.exports = {
  create,
};
