const { Router } = require('express');
const { users } = require('../controllers');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'));

router.post('/posts', users.createUser);

module.exports = router;
