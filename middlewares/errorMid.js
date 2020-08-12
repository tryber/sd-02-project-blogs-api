const errorReceive = {
  internal_error: 400,
  not_found: 404,
  invalid_data: 422,
  conflict: 409
};

const errorMid = (err, _req, res, _next) =>
  res.status(errorReceive[err.code])
    .json({
      err,
    });

module.exports = errorMid;