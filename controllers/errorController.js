const errors = {
  bad_request: 400,
  unauthorized: 401,
  access_denied: 403,
  not_found: 404,
  already_exists: 409,
  invalid_data: 422,
  internal_error: 500,
};

const errorController = (err, _req, res, _next) => {
  console.log(Object.keys(err));
  return res.status(errors[err.code]).json({ message: err.error });
};

module.exports = {
  errorController,
};
