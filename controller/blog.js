const blog = require('../service/blogService');

const objectError = {
  notFound: () => ({ message: 'Postagem não existe', code: 'not_found' }),
  invalid: () => ({ message: 'Campos inválidos', code: 'invalid_data' }),
  forbidden: () => ({ message: 'Atualização proibida', code: 'forbidden' }),
};

const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) return next(objectError.invalid());
  const newPost = await blog.postInBlog(req.user, { title, content });
  return res.status(201).json(newPost);
};

const getAllPosts = async (_req, res) => {
  const data = (await blog.getAllPosts()) || [];
  res.status(200).json(data.map(({ dataValues }) => dataValues));
};

const getOnePost = async ({ params: { id } }, res, next) => {
  const data = await blog.getOnePost(id);
  if (!data) return next(objectError.notFound());
  return res.status(200).json(data);
};

const putPost = async (req, res, next) => {
  const { id } = req.params;
  const [result] = (await blog.getOnePost(id)) || {};
  if (req.user.id !== result.dataValues.user.dataValues.id) return next(objectError.forbidden());
  const { title, content } = req.body;
  if (!title || !content) return next(objectError.invalid());
  const data = await blog.putPost(id, title, content);
  res.status(200).json(data);
};

module.exports = { createPost, getAllPosts, getOnePost, putPost };
