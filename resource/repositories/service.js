function getFields(data) {
  return Object.keys(data)
    .filter((key) => data[key])
    .reduce((fields, key) => ({ ...fields, [key]: data[key] }), {});
}

module.exports = { getFields };
