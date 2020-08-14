module.exports = paramExist = (...params) =>
  params.every((param) => param !== undefined);
