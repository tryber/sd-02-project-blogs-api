const jwt = require('jsonwebtoken');
const { User } = require('../models');

const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'Um token é necessário' });

  let id;

  try {
    id = jwt.verify(token, JWT_SECRET).id;
  } catch (e) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  const user = await User.findByPk(id);
  if (!user) return res.status(401).json('Usuário do token não encontrado');

  req.user = user;

  next();
};
