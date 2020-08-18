const errorReceive = {
  internal_error: 500,
  not_found: 404,
  invalid_data: 400,
  conflict: 409,
  unauthorized: 401,
  forbidden: 403,
};

const errorMid = (err, _req, res, _next) =>
  res.status(errorReceive[err.code]).json({
    err,
  });

module.exports = errorMid;