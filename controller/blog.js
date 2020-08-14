const blog = require('../service/blogService');

const objectError = {
  // conflict: () => ({ message: 'Usuário já existe', code: 'conflict' }),
  invalid: () => ({ message: 'Campos inválidos', code: 'invalid_data' }),
};

const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) return next(objectError.invalid());
  const newPost = await blog.postInBlog(req.user, { title, content });
  return res.status(201).json(newPost);
};

const getAllPosts = async (_req, res) => {
  const data = await blog.getAllPosts() || [];
  res.status(200).json(data.map(({ dataValues }) => dataValues));
};

module.exports = { createPost, getAllPosts };
