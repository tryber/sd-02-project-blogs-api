const jwt = require('jsonwebtoken');
const { findBy } = require('../service/userService');
const jwtSecret = 'trybe';

const authMiddleware = async (req, _res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next({ message: 'Token not found or reported', code: 'unauthorized' });
  }
  try {
    req.user = jwt.verify(token, jwtSecret).data;
    const userExist = await findBy({ email: req.user.email }, ['password']);
    if (Object.values(req.user).length === 0 || !userExist) return next({ message: 'User not found', code: 'unauthorized' });
    return next();
  } catch (error) {
    return next({ message: error.message, code: 'unauthorized' });
  }
};

module.exports = authMiddleware;