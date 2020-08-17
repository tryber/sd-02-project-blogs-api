const Joi = require('@hapi/joi');

const blogPost = Joi.object({
  title: Joi.string().messages({
    'string.base': 'Title must be a type of string',
    'string.empty': 'Title is not allowed to be empty',
  }),
  content: Joi.string().messages({
    'string.base': 'Content must be a type of string',
    'string.empty': 'Content is not allowed to be empty',
  }),
});

module.exports = blogPost;
