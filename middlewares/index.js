const { promiseErrors, endpointNotFound } = require('./errors');
const validateJWT = require('./validateJWT');

module.exports = {
  promiseErrors,
  endpointNotFound,
  validateJWT,
};
