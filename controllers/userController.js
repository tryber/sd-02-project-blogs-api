const { User } = require('../models');
const { validateUser } = require('../services/validation');
const { generateToken } = require('../services/authentication');

const register = async (req, res) => {
  const { displayName, email, password, image } = req.body;

  const { isValid, message } = validateUser(
    ['displayName', 'email', 'password'],
    [displayName, email, password],
  );
  if (!isValid) return res.status(422).json({ message });

  const [, created] = await User.findOrCreate({
    where: { email },
    defaults: { displayName, password, image },
  });
  if (!created) return res.status(409).json({ message: 'Usuário já existe' });

  const { dataValues: { password: _, ...user } } = await User.findOne({
    where: { email },
  });

  const token = generateToken(user);
  return res.status(201).json({ token });
};

const getAll = async (_req, res) => {
  const users = await User.findAll();
  const usersWithoutPassword = users.map(({ id, displayName, email, image }) => ({
    id,
    displayName,
    email,
    image,
  }));

  return res.status(200).json(usersWithoutPassword);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: ['id', 'displayName', 'email', 'image'],
  });

  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  return res.status(200).json(user);
};

const deleteMe = async (req, res) => {
  const { id } = req.user;

  await User.destroy({
    where: { id },
  });

  return res.status(200).json({ message: 'Usuário deletado com sucesso' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { isValid } = validateUser(
    ['email', 'password'],
    [email, password],
  );
  if (!isValid) return res.status(400).json({ message: 'Campos inválidos' });

  const user = await User.findOne({
    where: { email, password },
  });
  if (!user) return res.status(400).json({ message: 'Campos inválidos' });

  const { dataValues: { password: _, ...userWithoutPassword } } = user;

  const token = generateToken(userWithoutPassword);
  return res.status(200).json({ token });
};

module.exports = {
  register,
  getAll,
  getById,
  deleteMe,
  login,
};
