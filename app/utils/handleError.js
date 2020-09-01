const Boom = require('@hapi/boom');

const handleError = {
  exists: () => {
    throw Boom.badRequest('album already exists');
  },
  notFound: () => {
    throw Boom.badRequest('album not found');
  },
};

module.exports = handleError;
