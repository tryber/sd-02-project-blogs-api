const jwt = require('jsonwebtoken');
require('dotenv').config();

async function checkCreateFields(req, res, next) {
  const { displayName, email, password, image } = req.body;

  const validName = displayName && typeof displayName === 'string' && displayName.length > 7;
  const validEmail = email && typeof email === 'string' && /\S+@\S+/.test(email);
  const validPassword = password && password.toString().length >= 6;
  const validImage = image && typeof image === 'string';

  if (!validName || !validEmail || !validPassword || !validImage) {
    return res.status(400).json({
      message: 'dados inválidos: Preencha todos os campos / seu nome deve conter ao menos 8 caracteres / sua senha deve ter 6 caracteres',
    });
  }

  next();
}

async function authUser(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'operação não autorizada, token não encontrado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { id, displayName, email, image } = payload.data;

    const user = {
      id,
      displayName,
      email,
      image,
    };

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'operação não autorizada, token inválido' });
  }
}

module.exports = {
  checkCreateFields,
  authUser,
};
