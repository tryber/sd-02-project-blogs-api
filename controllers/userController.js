const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validateUser } = require('../services/userService');

const router = express.Router();

router.post('/', async (req, res, _next) => {
  const { displayName, email, password, image } = req.body;

  const { invalidData, message } = validateUser({ displayName, email, password });
  if (invalidData) return res.status(422).json({ message });

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
