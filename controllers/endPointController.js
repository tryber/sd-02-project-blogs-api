const endPointError = async (req, res) => {
  res.status(404).json({ error: { message: 'Endpoint not found', code: 'Not_found' } });
};

module.exports = endPointError;
