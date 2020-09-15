const express = require('express');
const Models = require('../models');

const router = express.Router();

router.post('/', async (req, res) => {
  const results = await Models.Users.findAll();

  res.status(200).json({
    message: 'Certo',
    data: results,
  });
});

module.exports = router;
