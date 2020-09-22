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

module.exports = {
  createBlogPost,
  getAllPosts,
};
