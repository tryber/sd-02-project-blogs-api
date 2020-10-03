const express = require('express');
const services = require('../services');
const middlewares = require('../middlewares/Auth');

const router = express.Router();

router
  .post('/', middlewares.InsertUser, services.userLogin);

router
  .get('/', middlewares.ValidUser, services.getAllUsers);

router
  .get('/:id', middlewares.ValidUser, services.getUser);

module.exports = {
  router,
};
