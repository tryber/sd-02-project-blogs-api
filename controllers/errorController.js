const codes = {
  invalid_data: 422,
  not_found: 404,
  something_wrong: 500,
  unauthorized: 400,
  missing_JWT: 401,
  access_denied: 403,
  conflict: 409,
};

const errorController = async (err, req, res, _next) => {
  res.status(codes[err.code]);
  res.json({ message: err.message });
  return res;
};

module.exports = {
  errorController,
};
