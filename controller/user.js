const jwt = require('jsonwebtoken');

const { User } = require('../models');
const Joi = require('../services/Joi');
const { createHash, checkString } = require('../services/bcrypt');
const paramExist = require('../services/paramExist');


const JWT_SECRET = process.env.JWT_SECRET;
const jwtConfig = {
  expiresIn: '60m',
  algorithm: 'HS256',
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!paramExist(email, password)) {
    return res.status(400).json({ message: 'email e password devem ser passados' });
  }

  const { dataValues } = await User.findOne({ where: { email } });

  if (!dataValues) { return res.status(404).json({ message: 'email não existente' }); }

  const isCorrectPassword = await checkString({
    string: password,
    hash: dataValues.password,
  });

  if (!isCorrectPassword) { return res.status(400).json({ message: 'password incorreto' }); }

  const { password: _, ...userWithoutPassword } = dataValues;

  const token = jwt.sign({ user: userWithoutPassword }, JWT_SECRET, jwtConfig);

  res.status(200).json({ token });
};

const register = async (req, res) => {
  const { displayName, email, password, image } = req.body;

  if (!paramExist(displayName, email, password, image)) {
    return res.status(400).json({ message: 'displayName, email, password devem ser passados' });
  }

  await Joi.user.validateAsync({ displayName, email, password, image });

  if (await User.findOne({ where: { email } })) {
    return res.status(409).json({ message: 'Usuário já existe' });
  }

  const hash = await createHash(password);

  const { password: _, ...withoutPassword } =
    await User.create({ displayName, email, password: hash, image });

  res.status(201).json(withoutPassword);
};

const findAll = async (_req, res) => {
  const users = await User.findAll();

  res.status(200).json(users);
};

const findById = async (req, res) => {
  const { id } = req.params;
  const user = await User
    .findByPk(id, { attributes: { exclude: ['password'] } });

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  res.status(200).json(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.user.dataValues;

  const response = await User.destroy({ where: { id } });

  res.status(200).json(response);
};

module.exports = {
  register,
  findAll,
  findById,
  login,
  deleteUser,
};
