const Joi = require('@hapi/joi');

const MAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const schema = Joi.object({
  displayName: Joi.string().min(8).required(),
  email: Joi.string().pattern(MAIL_REGEX).required(),
  password: Joi.string().min(6).max(6).required(),
  image: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(MAIL_REGEX).required(),
  password: Joi.string().min(6).max(6).required(),
});

const blogPostSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

module.exports = {
  schema,
  loginSchema,
  blogPostSchema,
};
