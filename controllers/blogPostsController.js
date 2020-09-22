const rescue = require('express-rescue');
const joiSchema = require('../middlewares/errorJoi');
const blogPostsService = require('../services/blogPostsService');

const createBlogPost = rescue(async (req, res, next) => {
  const { title, content } = req.body;
  const { email } = req.user;

  const { error } = joiSchema.blogPostSchema
    .validate({ title: title.trim(), content: content.trim() });

  if (error) return next({ error: 'Campos inválidos', code: 'bad_request' });

  await blogPostsService.createBlogPost(title, content, email);

  return res.status(200).end();
});

const getAllPosts = rescue(async (_req, res) => {
  const allPosts = await blogPostsService.getAllPosts();
  return res.status(200).json(allPosts);
});

const getPostBySearchTerm = rescue(async (req, res, next) => {
  const { q } = req.query;
  const teste = await blogPostsService.getPostBySearchTerm(q);
  return res.status(200).json(teste);
});

const updateById = rescue(async (req, res, next) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const { email } = req.user;

  const { error } = joiSchema.blogPostSchema
    .validate({ title: title.trim(), content: content.trim() });

  if (error) return next({ error: 'Campos inválidos', code: 'bad_request' });

  const userError = await blogPostsService.validateUser(email);

  if (userError.error) return next(userError);

  await blogPostsService.updateById(title, content, id);

  res.status(200).end();
});

const getPostById = rescue(async (req, res, next) => {
  const { id } = req.params;
  const post = await blogPostsService.getPostsById(id);
  if (!post) return next({ error: 'Post não encontrado', code: 'not_found' });
  return res.status(200).json(post);
});

module.exports = {
  createBlogPost,
  getAllPosts,
  updateById,
  getPostById,
  getPostBySearchTerm,
};
