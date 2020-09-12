module.exports = (error, _req, res, _next) => (
  res.status(500).json({
    message: error.message || 'Algo deu errado',
  })
);
