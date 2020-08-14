const Joi = require('@hapi/joi');

const email = Joi.string().email()
  .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  .messages({
    'any.required': 'Email is required',
    'string.base': 'Email must be a type of string',
    'string.email': 'Email must be in a format <name>@<domain>',
    'string.empty': 'Email is not allowed to be empty',
  });

const displayName = Joi.string()
  .regex(/^[^\s][a-zA-Z\s]*[a-zA-z]$/)
  .min(8)
  .required()
  .messages({
    'any.required': 'Name is required',
    'string.base': 'Name must be a type of string',
    'string.empty': 'Name is not allowed to be empty',
    'string.min': 'Name length must be at least 8 characters long',
    'string.pattern.base':
      'Name must not contain any numbers, special characters or space in the start or in the end',
  });

const password = Joi.string()
  .pattern(new RegExp('^[a-zA-Z0-9]{6,}$'))
  .required();

const userSchema = Joi.object({
  email,
  displayName,
  password,
});

const validate = async (schema, body) => {
  try {
    const { error } = await schema.validate(body, {
      abortEarly: false,
    });
    return { error };
  } catch (err) {
    return { error: err };
  }
};

module.exports = { userSchema, validate };