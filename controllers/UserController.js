const express = require('express');
const middlewares = require('../middlewares');
const UserService = require('../services/UserService');

const router = express.Router();

router.post('/', middlewares.user.checkCreateFields, async (req, res) => {
  const { displayName, email, password, image } = req.body;

  try {
    const user = await UserService.create({ displayName, email, password, image });

    if (user.error) return res.status(user.code).json({ message: user.message });

    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
});

module.exports = router;
