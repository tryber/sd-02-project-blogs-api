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

module.exports = {
  loginUser,
  createUser,
};
