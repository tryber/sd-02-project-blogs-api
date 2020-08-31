const { User } = require('../models');
const { createHash } = require('../services/bcrypt');
const createToken = require('../services/createToken');
const validate = require('../services/validate');


const login = async (req, res, next) => {
  const { email, password } = req.body;
  let dataValues;

  try {
    dataValues = await validate.user.login({ email, password });
    await validate.user.checkPassword({ dataValues, password });
  } catch (err) {
    return next(err);
  }

  const token = createToken(dataValues);

  res.status(200).json({ token });
};

const register = async (req, res, next) => {
  const { displayName, email, password, image } = req.body;

  try {
    await validate.user.register({ displayName, email, password, image });
  } catch (err) {
    return next(err);
  }

  const hash = await createHash(password);

  const { dataValues } = await User.create({ displayName, email, password: hash, image });

  const token = createToken(dataValues);

  res.status(201).json({ token });
};

const findAll = async (_req, res) => {
  const users = await User.findAll();

  res.status(200).json(users);
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User
    .findByPk(id, { attributes: { exclude: ['password'] } });

  try {
    await validate.user.findById(user);
  } catch (err) {
    return next(err);
  }

  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.user.dataValues;

  await User.destroy({ where: { id } });

  res.status(200).json({ message: 'usuário deletado com sucesso' });
};

module.exports = {
  register,
  findAll,
  findById,
  login,
  deleteUser,
};
