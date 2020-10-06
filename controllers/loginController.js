const express = require('express');
const middlewares = require('../middlewares/Auth');
const services = require('../services');

const router = express.Router();

router
  .post('/', middlewares.LoginValidate, services.loginUser);

module.exports = { router };
