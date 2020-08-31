const express = require('express');
const rescue = require('express-rescue');

const { auth } = require('../middleware');
const { post } = require('../controller');

const router = express.Router();

router.post('/', auth, rescue(post.insert));
router.get('/', rescue(post.findAll));
router.put('/:id', auth, rescue(post.updateById));
router.get('/search', rescue(post.search));
router.get('/:id', rescue(post.findById));
router.delete('/:id', auth, rescue(post.deletePost));

module.exports = router;
