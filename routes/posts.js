const { Router } = require('express');
const { posts } = require('../controllers');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/', auth, posts.createPost);

router.get('/search', posts.searchPost);

router.get('/', posts.listPosts);

router.put('/:id', auth, posts.updatePost);

router.get('/:id', posts.listPost);

router.delete('/:id', auth, posts.deletePost);

module.exports = router;
