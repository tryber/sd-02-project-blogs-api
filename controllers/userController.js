const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, _next) => {
  const { displayName, email, password, image } = req.body;

  let message = '';

  if (typeof displayName !== 'string' || displayName.length < 8) {
    message = 'displayName deve ter pelo menos 8 caracteres. ';
  }

  if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email)) {
    message = `${message}Insira um email válido. `;
  }

  if (typeof password !== 'string' || password.length !== 6) {
    message = `${message}A senha deve conter 6 caracteres.`;
  }

  if (message) return res.status(422).json({ message });

  try {
    const [, created] = await User.findOrCreate({
      where: { email },
      defaults: { displayName, password, image },
    });

    if (!created) return res.status(409).json({ message: 'Usuário já existe' });

    const { dataValues: { password: _, ...user } } = await User.findOne({
      where: { email },
    });

    const token = jwt.sign(user, process.env.SECRET, {
      expiresIn: '50m',
      algorithm: 'HS256',
    });

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Algo deu errado' });
  }
});

module.exports = router;
