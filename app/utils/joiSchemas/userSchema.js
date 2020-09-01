const Joi = require('@hapi/joi');

const email = Joi.string().email().required().messages({
  'any.required': 'Email is required',
  'string.base': 'Email must be a type of string',
  'string.email': 'Email must be in a format <name>@<domain>',
  'string.empty': 'Email is not allowed to be empty',
});

const displayName = Joi.string().min(8).required().messages({
  'any.required': 'Name is required',
  'string.base': 'Name must be a type of string',
  'string.empty': 'Name is not allowed to be empty',
  'string.min': 'Name length must be at least 8 characters long',
});

const password = Joi.string().min(6).required().messages({
  'any.required': 'Password is required',
  'string.base': 'Password must be a type of string',
  'string.empty': 'Password is not allowed to be empty',
  'string.min': 'Password length must be at least 6 characters long',
});

const image = Joi.string().messages({
  'string.base': 'Image must be a type of string',
  'string.empty': 'Image is not allowed to be empty',
});

const loginSchema = Joi.object({
  email,
  password,
}).unknown(false);

const registerSchema = Joi.object({
  email,
  displayName,
  password,
  image,
}).unknown(false);

module.exports = {
  loginSchema,
  registerSchema,
};
