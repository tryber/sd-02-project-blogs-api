const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;


module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'token inválido' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ where: { email: payload.user.email } });

    if (!user) {
      return res.status(401).json({ message: 'usuário não encontrado' });
    }

    const { password: _, ...userWithoutPasswordAndId } = user;
    req.user = { ...userWithoutPasswordAndId };

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
