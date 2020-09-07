const Boom = require('@hapi/boom');

const {
  jsonWebToken: { verifyToken },
} = require('../utils');

const { userModel: Model } = require('../resource');

async function authMiddleware(req, _res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) throw Boom.unauthorized('Token not found');

    const decoded = verifyToken(token);

    const userModel = new Model({ email: decoded.data.email });

    const user = await userModel.findBy('email');

    if (user.length === 0) throw Boom.unauthorized('Error by looking a user with this token');

    req.user = user[0].dataValues;

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
