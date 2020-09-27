const { Router } = require('express');
const { users } = require('../controllers');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/', users.createUser);

router.get('/', auth, users.list);

router.get('/:id', auth, users.listOne);

router.delete('/me', auth, users.deleteUser);

router.post('/login', users.loginUser);

module.exports = router;
