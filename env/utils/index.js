const bcrypt = require('./bcrypt');

const jsonWebToken = require('./jsonWebToken');

function getFieldsFilled(data) {
  return Object.fromEntries(Object.entries(data).filter(([_, value] => value)));
}

module.exports = {
  bcrypt,
  getFieldsFilled,
  jsonWebToken,
};
