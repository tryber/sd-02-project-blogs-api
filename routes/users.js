const express = require('express');
const rescue = require('express-rescue');
const { auth } = require('../middleware');

const { user } = require('../controller');

const router = express.Router();

router.post('/', rescue(user.register));
router.get('/', auth, rescue(user.findAll));
router.get('/:id', auth, rescue(user.findById));
router.delete('/me', auth, rescue(user.deleteUser));

module.exports = router;
