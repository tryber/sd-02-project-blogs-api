const { Router } = require('express');
const { posts } = require('../controllers');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/', auth, posts.createPost);

router.get('/', posts.listPosts);

module.exports = router;
