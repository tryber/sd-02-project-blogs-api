const error = async (err, _req, res, _next) => {
  if (err.details) {
    return res.status(400).json({ error: { message: err.details[0].message } });
  }
  const { code, message } = err;

  return res.status(code).json({ message });
};

module.exports = error;
