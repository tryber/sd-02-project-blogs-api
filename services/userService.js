const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const jwtSecret = process.env.JWT_SECRET;

const jwtConfig = {
  expiresIn: '300m',
  algorithm: 'HS256',
};

const validateTokenUser = (user) => {
  const { dataValues: { id, password, ...userInfo } } = user;
  const token = jwt.sign({ data: userInfo }, jwtSecret, jwtConfig);
  return token;
};

const findOneAndCreated = async (email, value) => {
  try {
    const [user, created] = await Users.findOrCreate({
      where: { email },
      defaults: value,
    });
    if (created) {
      return ({ token: validateTokenUser(user) });
    }
    return ({ error: 'Usuário já existe', code: 'already_exists' });
  } catch (err) {
    return ({ error: 'Erro no banco de dados', code: 'internal_error' });
  }
};

const getAllUsers = async () => {
  try {
    const responseDb = await Users.findAll();
    const users = responseDb
      .map(({ dataValues: { id, displayName, email, image } }) => (
        {
          id,
          displayName,
          email,
          image,
        }
      ));
    return users;
  } catch (err) {
    return ({ error: 'Erro no banco de dados', code: 'internal_error' });
  }
};

const deleteUser = async (email) => {
  try {
    const deletedUser = await Users.destroy({ where: { email } });
    return deletedUser;
  } catch (err) {
    return ({ error: 'Erro no banco de dados', code: 'internal_error' });
  }
};

const getUserById = async (id) => {
  try {
    const responseDb = await Users.findOne({ where: { id } });
    if (responseDb) return responseDb.dataValues;
    return ({ error: 'Usuário/a não encontrado/a', code: 'not_found' });
  } catch (err) {
    return ({ error: 'Erro no banco de dados', code: 'internal_error' });
  }
};

module.exports = {
  findOneAndCreated,
  getAllUsers,
  deleteUser,
  getUserById,
};
