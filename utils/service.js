function getFields(data) {
  return Object.fromEntries(Object.entries(data).filter(([key, value]) => value && key !== 'id'));
}

module.exports = {
  getFields,
};
