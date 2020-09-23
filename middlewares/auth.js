const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = 'mypassword123';

module.exports = async (req, res, next) => {
  const token = req.headers.authorization || null;

  if (!token) {
    return res.status(400).json({ error: 'Token não encontrado ou informado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.data.dataValues.id } });

    if (!user) {
      return res.status(401).json({ message: 'Erro ao procurar usuario do token.' });
    }
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Erro: Seu token é inválido' });
  }
};
