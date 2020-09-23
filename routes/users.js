const { Router } = require('express');
const { users } = require('../controllers');
const auth = require('../middlewares/auth');

const router = Router();

router.post('/', users.createUser);

router.get('/', auth, users.list);

module.exports = router;
