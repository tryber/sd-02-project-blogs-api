require('dotenv').config();

const Models = require('../models');
const { UserSchema, LoginSchema } = require('../services');
const { verifyToken } = require('../services/Jwt');
const { PostSchema } = require('../services/SchemaJoi');

const InsertUser = (req, res, next) => {
  const { password, ...others } = req.body;
  const { error } = UserSchema.validate({ ...others, password: `${password}` });
  if (error) {
    return res
      .status(400)
      .json({
        error: error.details[0].message,
        message: 'Campos Inválidos',
      });
  }
  return next();
};

const LoginValidate = (req, res, next) => {
  const { email, password } = req.body;
  const { error } = LoginSchema.validate({ email, password: `${password}` });
  if (error) {
    return res
      .status(400)
      .json({
        error: error.details[0].message,
        message: 'Campos Inválidos',
      });
  }
  return next();
};

const ValidUser = async (req, res, next) => {
  const encryptedData = verifyToken(req.headers.authorization);

  if (encryptedData.message) {
    return res.status(401).json({
      error: encryptedData.message,
      code: 'unauthorized',
    });
  }

  const isUserExists = await Models.Users.findOne({ where: { email: encryptedData.email } });

  if (!isUserExists) {
    return res.status(401).json({
      error: 'User not found. Do you have account in this beatiful api?',
      code: 'not_found',
    });
  }

  return next();
};

const PostValid = async (req, res, next) => {
  const { title, content } = req.body;
  const { error } = PostSchema.validate({ title, content });
  if (error) {
    return res
      .status(400)
      .json({
        error: error.details[0].message,
      });
  }
  return next();
};

module.exports = {
  LoginValidate,
  InsertUser,
  ValidUser,
  PostValid,
};
