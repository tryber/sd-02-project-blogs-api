const rescue = require('express-rescue');
const blog = require('../service/blogService');

const objectError = {
  notFound: () => ({ message: 'Postagem não existe', code: 'not_found' }),
  invalid: () => ({ message: 'Campos inválidos', code: 'invalid_data' }),
};

const confirmParams = (title, content) => !title || !content;

const createPost = rescue(async (req, res, next) => {
  const { title, content } = req.body;
  if (confirmParams(title, content)) return next(objectError.invalid());
  const newPost = await blog.postInBlog(req.user, { title, content });
  return res.status(201).json(newPost);
});

const getAllPosts = rescue(async (_req, res) => {
  const data = (await blog.getAllPosts()) || [];
  res.status(200).json(data.map(({ dataValues }) => dataValues));
});

const getOnePost = rescue(async ({ params: { id } }, res, next) => {
  const data = await blog.getOnePost(id);
  if (!data) return next(objectError.notFound());
  return res.status(200).json(data);
});

const putPost = rescue(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (confirmParams(title, content)) return next(objectError.invalid());
  await blog.putPost(id, title, content);
  return res.status(204).end();
});

const getForText = rescue(async (req, res) => {
  const data = await blog.findForText(req.query.q);
  return res.status(200).json(data);
});

const deletePost = rescue(async (req, res) => {
  await blog.excludePost(req.params.id);
  return res.status(204).end();
});

module.exports = { createPost, getAllPosts, getOnePost, putPost, getForText, deletePost };
