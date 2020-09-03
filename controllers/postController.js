const rescue = require('express-rescue');
const postService = require('../services/postService');
const schemasJoi = require('./schemasJoi');
const validateJoi = require('./validateJoi');

const createPost = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.createOrUpdatePost, req.body);
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

const updatePostById = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.createOrUpdatePost, req.body);
  if (isValid.error) return next(isValid);

  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const { ...postInfo } = req.body;

  const serviceAnswer = await postService.updatePostById(postInfo, postId, userId);
  if (serviceAnswer.error) return next(serviceAnswer);

  return res.status(200).json(serviceAnswer);
});

const getPostById = rescue(async (req, res, next) => {
  const { id } = req.params;

  const serviceAnswer = await postService.getPostById(id);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

const getPostByQuery = rescue(async (req, res, _next) => {
  const { q: queryParam } = req.query;
  const serviceAnswer = await postService.getPostByQuery(queryParam);
  // if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

const deletePostById = rescue(async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;

  const serviceAnswer = await postService.deletePostById(postId, userId);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(204).end();
});

module.exports = {
  createPost,
  getAllPosts,
  updatePostById,
  getPostById,
  getPostByQuery,
  deletePostById,
};
