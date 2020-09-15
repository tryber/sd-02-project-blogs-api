const Joi = require('joi');

const UserSchema = Joi.object({
  displayName: Joi
    .string()
    .min(8)
    .required(),
  email: Joi
    .string()
    .email()
    .required(),
  password: Joi
    .string()
    .length(6)
    .required(),
  image: Joi
    .string()
    .min(10),
});

const PostSchema = Joi.object({
  title: Joi
    .string()
    .min(3)
    .required(),
  content: Joi
    .string()
    .min(10)
    .required(),
});

module.exports = {
  UserSchema,
  PostSchema,
};
