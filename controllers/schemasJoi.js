const Joi = require('joi');

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

module.exports = {
  login,
};
