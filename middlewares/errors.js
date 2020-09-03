const objError = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  already_exists: 409,
  invalid_data: 422,
};

const promiseErrors = (err, _req, res, _next) => {
  const statusCode = objError[err.code] || err.statusCode || 500;
  return res.status(statusCode).json({ message: err.message });
};

const endpointNotFound = (_req, res) =>
  res.status(404).json({ message: 'Endpoint não encontrado' });

module.exports = {
  promiseErrors,
  endpointNotFound,
};
