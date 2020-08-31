const paramExist = require('../paramExist');
const Joi = require('../Joi');
const { User } = require('../../models');
const { checkString } = require('../bcrypt');

const login = async ({ email, password }) => {
  if (!paramExist(email, password)) {
    return Promise.reject({ message: 'email e password devem ser passados', code: 400 });
  }

  try {
    await Joi.user.validateAsync({ email, password }); 
  } catch (_err) {
    return Promise.reject({ message: 'Campos inválidos', code: 400 });
  }

  const response = await User.findOne({ where: { email } });

  if (!response) { return Promise.reject({ message: 'email não existente', code: 404 }); }

  const { dataValues } = response;
  
  return dataValues;
};

const checkPassword = async ({ dataValues, password }) => {
  const isCorrectPassword = await checkString({ string: password, hash: dataValues.password });

  if (!isCorrectPassword) { return Promise.reject({ message: 'password incorreto', code: 400 }); }
};

const register = async ({ displayName, email, password, image }) => {
  if (!paramExist(displayName, email, password, image)) {
    return Promise.reject({ message: 'displayName, email, password devem ser passados', code: 400 });
  }

  await Joi.user.validateAsync({ displayName, email, password, image });

  if (await User.findOne({ where: { email } })) {
    return Promise.reject({ message: 'usuário já existe', code: 409 });
  }
};

const findById = async (user) => {
  if (!user) {
    return Promise.reject({ message: 'usuário não encontrado', code: 404 });
  }
};

module.exports = {
  login,
  checkPassword,
  register,
  findById,
};
