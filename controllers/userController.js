const express = require('express');
const rescue = require('express-rescue');
const joiSchema = require('../middlewares/errorJoi');
const { Users } = require('../models');

const router = express.Router();

router.post('/', rescue(async (req, res, next) => {
  const { displayName, email, password, image } = req.body;

  const { error, value } = await joiSchema.validate({ displayName, email, password, image });

  if (error) next({ error: error.details[0].message, code: 'invalid_data' });

  const [user, created] = await Users.findOrCreate({
    where: { email },
    defaults: value,
  });
  if (created) return res.status(201).json(user);
  next({ error: 'Usuário já existe', code: 'already_exists' });
}));

module.exports = router;
