const express = require('express');
const Models = require('../models');
const services = require('../services');
const middlewares = require('../middlewares/Auth');

const router = express.Router();

router.post('/', middlewares.InsertUser, async (req, res) => {
  const isExistsUser = await Models.Users.findOne({ where: { email: req.body.email } });

  if (isExistsUser) {
    return res.status(409).json({
      message: 'Usuário já existe',
    });
  }

  await Models.Users.create({ ...req.body });

  return res.status(201).json({
    token: services.newToken(req.body),
  });
});

module.exports = router;
