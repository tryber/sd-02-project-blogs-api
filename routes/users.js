const { Router } = require('express');
const { users } = require('../controllers');

const router = Router();

router.get('/', users.welcome);

router.post('/', users.createUser);

module.exports = router;
