const error = async (err, _req, res, _next) => {
  if (err.details) {
    return res.status(400).json({ error: { message: err.details[0].message } });
  }

  return res.status(500).json(err);
};

module.exports = error;
