const rescue = require('express-rescue');
const validateJoi = require('../middlewares/validateJoi');
// const JwT = require('../middlewares/JwT');
const PostService = require('../services/PostService');
const { schemaNewPost } = require('../middlewares/schemasJoi');

const newPost = rescue(async (req, res) => {
  await validateJoi(schemaNewPost, req.body);
  const { id: userId } = req.user;
  const { title, content } = req.body;
  const serviceAnswer = await PostService.newPost(userId, title, content);
  res.status(201).json(serviceAnswer);
});

const getAllPosts = rescue(async (req, res) => {
  const serviceAnswer = await PostService.getAllPosts();
  res.status(200).json(serviceAnswer);
});

module.exports = {
  newPost,
  getAllPosts,
};
