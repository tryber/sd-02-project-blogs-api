const Joi = require('@hapi/joi');

const confirm = Joi.string().valid(Joi.ref('password')).required().messages({
  'any.only': 'Confirm password and password must match',
  'any.required': 'Confirm is required',
  'string.base': 'Confirm must be a type of string',
  'string.empty': 'Confirm is not allowed to be empty',
});

const email = Joi.string().email().required().messages({
  'any.required': 'Email is required',
  'string.base': 'Email must be a type of string',
  'string.email': 'Email must be in a format <name>@<domain>',
  'string.empty': 'Email is not allowed to be empty',
});

const name = Joi.string()
  .regex(/^[^\s][a-zA-Z\s]*[a-zA-z]$/)
  .min(12)
  .required()
  .messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a type of string',
    'string.empty': 'Name is not allowed to be empty',
    'string.min': 'Name length must be at least 12 characters long',
    'string.pattern.base':
      'Name must not contain any numbers, special characters or space in the start or in the end',
  });

const password = Joi.string()
  .pattern(/^.*(.*\d){6,}/)
  .required()
  .messages({
    'any.required': 'Password is required',
    'string.base': 'Password must be a type of string',
    'string.empty': 'Password is not allowed to be empty',
    'string.pattern.base': 'Password must contain at least 6 numbers',
  });

const role = Joi.string().required().messages({
  'any.required': 'Role is required',
  'string.base': 'Role must be a type of string',
  'string.empty': 'Role is not allowed to be empty',
});

const loginSchema = Joi.object({
  email,
  password,
}).unknown(false);

const profileSchema = Joi.object({
  name,
  email,
}).unknown(false);

const registerSchema = Joi.object({
  confirm,
  email,
  name,
  password,
  role,
}).unknown(false);

module.exports = {
  loginSchema,
  profileSchema,
  registerSchema,
};
