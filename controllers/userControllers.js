const rescue = require('express-rescue');
const { userValidation } = require('../services/joiValidation');
const { CommonError, UserAlreadyRegistered } = require('../services/errorScheme');
const { Users } = require('../models');

const addUser = rescue(async (req, res) => userValidation.validateAsync(req.body)
  .then(async () => {
    const { body: { displayName, email, password, image } } = req;
    return Users.create({ displayName, email, password, image })
      .then((user) => res.status(201).send('token'))
      .catch((err) => {
        if (err.parent.errno === 1062) {
          throw new UserAlreadyRegistered();
        }
        throw new CommonError(err);
      });
  })
  .catch((err) => {
    throw new CommonError(err);
  }));

module.exports = {
  addUser,
};
