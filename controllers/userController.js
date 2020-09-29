const express = require('express');
const services = require('../services');
const middlewares = require('../middlewares/Auth');

const router = express.Router();

router
  .post('/', middlewares.InsertUser, services.userLogin);

module.exports = {
  router,
};
