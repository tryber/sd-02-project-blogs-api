function getFilledFields(data) {
  return Object.fromEntries(Object.entries(data).filter(([_, value]) => value));
}

module.exports = {
  getFilledFields,
};
