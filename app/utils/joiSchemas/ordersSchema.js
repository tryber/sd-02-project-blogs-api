const Joi = require('@hapi/joi');

const totalPrice = Joi.number().positive().required()
  .messages({
    'number.positive': 'totalPrice must be a positive value',
    'any.required': 'totalPrice is required',
    'number.base': 'totalPrice must be a number',
    'number.empty': 'totalPrice is not allowed to be empty',
  });

const address = Joi.string().max(100).required()
  .messages({
    'any.required': 'address is required',
    'string.base': 'address must be a type of string',
    'string.empty': 'address is not allowed to be empty',
    'string.max': 'address length must be at maximum 100 characters long',
  });

const number = Joi.number().integer().positive().required()
  .messages({
    'number.positive': 'number must be a positive value',
    'any.required': 'number is required',
    'number.base': 'number must be a number',
    'number.empty': 'number is not allowed to be empty',
    'number.integer': 'number must be an integer',
  });

const products = Joi.array().required()
  .messages({
    'number.empty': 'products is not allowed to be empty',
    'any.required': 'products is required',
    'number.base': 'products must be a number',
  });

const ordersSchema = Joi.object({
  totalPrice,
  address,
  number,
  products,
}).unknown(false);

module.exports = ordersSchema;
