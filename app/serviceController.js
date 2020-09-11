function find({ Domain, model, domainKey, modelkey, handleError }) {
  return async (req, res) => {
    const domain = new Domain({ [modelkey]: model, id: req.params.id });

    const { data, error } = await domain.find();

    if (error) return handleError[error]();

    res.status(200).json({ [domainKey]: data });
  };
}

function remove({ Domain, model, modelkey }) {
  return async (req, res) => {
    const domain = new Domain({ [modelkey]: model, id: req.params.id });

    await domain.remove();

    res.status(204).end();
  };
}

function update({ Domain, model, domainKey, modelkey, handleError }) {
  return async (req, res) => {
    const domain = new Domain({ [modelkey]: model, ...req.body, id: req.params.id });

    const { data, error } = await domain.update();

    if (error) return handleError[error]();

    res.status(200).json({ [domainKey]: data });
  };
}

module.exports = {
  find,
  remove,
  update,
};
