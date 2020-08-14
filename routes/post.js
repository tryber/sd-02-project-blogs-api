const express = require('express');
const rescue = require('express-rescue');

const { post } = require('../controller');

const router = express.Router();

router.post('/', rescue(post.insert));
router.get('/', rescue(post.findAll));
router.put('/:id', rescue(post.updateById));
router.get('/search', rescue(post.search));
router.get('/:id', rescue(post.findById));
router.delete('/:id', rescue(post.deletePost));

module.exports = router;
