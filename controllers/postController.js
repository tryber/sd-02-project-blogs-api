const rescue = require('express-rescue');
const postService = require('../services/postService');
const schemasJoi = require('./schemasJoi');
const validateJoi = require('./validateJoi');

const createPost = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.createPost, req.body);
  if (isValid.error) return next(isValid);

  const userInfo = { ...req.body };
  const { id: userId } = req.user;

  const serviceAnswer = await postService.createPost(userInfo, userId);
  return res.status(201).json(serviceAnswer);
});

const getAllPosts = rescue(async (_req, res) => {
  const serviceAnswer = await postService.getAllPosts();
  return res.status(200).json(serviceAnswer);
});

module.exports = {
  createPost,
  getAllPosts,
};
