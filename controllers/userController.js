const express = require('express');
const Models = require('../models');
const middlewares = require('../middlewares/Auth');

const router = express.Router();

router.post('/', middlewares.InsertUser, async (req, res) => {
  const results = await Models.Users.findAll();

  res.status(200).json({
    message: 'Certo',
    data: results,
  });
});

module.exports = router;
