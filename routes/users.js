const express = require('express');
const rescue = require('express-rescue');

const { user } = require('../controller');

const router = express.Router();

router.post('/', rescue(user.register));
router.get('/', rescue(user.findAll));
router.get('/:id', rescue(user.findById));
router.delete('/me', rescue(user.deleteUser));

module.exports = router;
