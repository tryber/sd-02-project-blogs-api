const Joi = require('joi');

const loginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

const createUser = Joi.object({
  displayName: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
  image: Joi.string(),
});

const createOrUpdatePost = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

module.exports = {
  loginUser,
  createUser,
  createOrUpdatePost,
};
