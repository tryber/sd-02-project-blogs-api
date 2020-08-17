const { User } = require('../models');
const middlewares = require('../middlewares/JwT');

const newUser = async ({ displayName, email, password, image }) => {
  const existUser = await User.findOne({ where: { email } });
  if (existUser) {
    const error = { error: { message: 'Usuário já existe.', code: 'Already_exists' } };
    throw error;
  }
  const modelAnswer = await User.create({ displayName, email, password, image });
  const { dataValues: { password: _, ...noPass } } = modelAnswer;
  const tokenJwt = middlewares.generateToken(noPass);
  return tokenJwt;
};

const getAllUsers = async () => {
  const modelAnswer = await User.findAll({ attributes: { exclude: ['password'] } })
    .catch((e) => {
      const error = { error: { message: e.message, code: 'Internal_error' } };
      throw error;
    });
  if (modelAnswer.length === 0) {
    const error = { error: { message: 'Dados não encontrados.', code: 'Not_found' } };
    throw error;
  }
  return modelAnswer;
};

module.exports = {
  newUser,
  getAllUsers,
};
