const errorReceive = {
  internal_error: 500,
  not_found: 404,
  invalid_data: 422,
  conflict: 409,
  unauthorized: 401
};

const errorMid = (err, _req, res, _next) =>
  res.status(errorReceive[err.code])
    .json({
      err,
    });

module.exports = errorMid;