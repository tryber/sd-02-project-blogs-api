const express = require('express');
const rescue = require('express-rescue');

const { user } = require('../controller');

const router = express.Router();

router.post('/', rescue(user.login));

module.exports = router;
