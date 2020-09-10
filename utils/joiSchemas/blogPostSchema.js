const Joi = require('@hapi/joi');

const content = Joi.string().required().messages({
  'string.base': 'content must be a type of string',
  'string.empty': 'content is not allowed to be empty',
  'string.min': 'content length must be at least 8 characters long',
});

const title = Joi.string().required().messages({
  'any.required': 'title is required',
  'string.base': 'title must be a type of string',
  'string.empty': 'title is not allowed to be empty',
});

const blogPostSchema = Joi.object({
  title,
  content,
}).unknown(false);

module.exports = blogPostSchema;
