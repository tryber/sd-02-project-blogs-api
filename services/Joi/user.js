const Joi = require('@hapi/joi');

const user = Joi.object({
  displayName: Joi.string().regex(/[a-zA-Z\s]+/).min(8).messages({
    'string.base': 'Name must be a type of string',
    'string.empty': 'Name is not allowed to be empty',
    'string.min': 'Name length must be at least 8 characters long',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email must be a type of string',
    'string.email': 'Email must be in a format <name>@<domain>',
    'string.empty': 'Email is not allowed to be empty',
  }),
  password: Joi.string().min(6).messages({
    'string.base': 'Password must be a type of string',
    'string.empty': 'Password is not allowed to be empty',
    'string.pattern.base': 'Password must contain at least 6 caracters',
  }),
  image: Joi.string().messages({
    'string.base': 'Image must be a type of string',
    'string.empty': 'Image is not allowed to be empty',
  }),
});

module.exports = user;
