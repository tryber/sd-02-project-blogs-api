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

  try {
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
  } catch (error) {
    return res.status(500).json({ message: 'Algo deu errado' });
  }
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

module.exports = {
  register,
  getAll,
};
