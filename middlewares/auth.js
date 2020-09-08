const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'Um token é necessário' });

  try {
    const { iat, exp, ...user } = jwt.verify(token, JWT_SECRET);
    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
