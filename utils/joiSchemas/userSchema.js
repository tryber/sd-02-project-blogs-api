const Joi = require('@hapi/joi');

const displayNameRequired = Joi.string().min(8).required().messages({
  'any.required': 'displayName is required',
  'string.base': 'displayName must be a type of string',
  'string.empty': 'displayName is not allowed to be empty',
  'string.min': 'displayName length must be at least 8 characters long',
});

const displayNameNotRequired = Joi.string().min(8).messages({
  'string.base': 'displayName must be a type of string',
  'string.empty': 'displayName is not allowed to be empty',
  'string.min': 'displayName length must be at least 8 characters long',
});

const email = Joi.string().email().required().messages({
  'any.required': 'email is required',
  'string.base': 'email must be a type of string',
  'string.email': 'email must be in a format <name>@<domain>',
  'string.empty': 'email is not allowed to be empty',
});

const image = Joi.string().messages({
  'string.base': 'Image must be a type of string',
  'string.empty': 'Image is not allowed to be empty',
});

const password = Joi.string().min(6).required().messages({
  'any.required': 'password is required',
  'string.base': 'password must be a type of string',
  'string.empty': 'password is not allowed to be empty',
  'string.min': 'password length must be at least 6 characters long',
});

const loginSchema = Joi.object({
  email,
  password,
}).unknown(false);

const registerSchema = Joi.object({
  email,
  displayName: displayNameRequired,
  password,
  image,
}).unknown(false);

const updateSchema = Joi.object({
  displayName: displayNameNotRequired,
  image,
}).unknown(false);

module.exports = {
  loginSchema,
  registerSchema,
  updateSchema,
};
