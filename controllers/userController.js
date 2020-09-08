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
  const usersWithouPassword = users.map(({ id, displayName, email, image }) => ({
    id,
    displayName,
    email,
    image,
  }));

  return res.status(200).json(usersWithouPassword);
};

const getById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: ['id', 'displayName', 'email', 'image'],
  });

  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  return res.status(200).json(user);
};

module.exports = {
  register,
  getAll,
  getById,
};
