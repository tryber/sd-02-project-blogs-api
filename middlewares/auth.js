const Boom = require('@hapi/boom');

const {
  jsonWebToken: { verifyToken },
} = require('../env/utils');

function auth(Model) {
  return async (req, _res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) throw Boom.badRequest('Token not found');

      const decoded = verifyToken(token);

      const userModel = new Model({ email: decoded.data.email });

      const user = await userModel.findBy('email');

      if (!user) throw Boom.unauthorized('Error by looking a user with this token');

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = auth;
