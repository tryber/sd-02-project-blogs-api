require('dotenv').config();
const Models = require('../models');
const { UserSchema } = require('../services');
const { verifyToken } = require('../services/Jwt');

const InsertUser = (req, res, next) => {
  const { password, ...others } = req.body;
  const { error } = UserSchema.validate({ ...others, password: `${password}` });
  if (error) {
    return res
      .status(422)
      .json({
        error: error.details[0].message,
        code: 'bad_data',
      });
  }
  return next();
};

const ValidUser = async (req, res, next) => {
  const encryptedData = verifyToken(req.headers.authorization);

  if (encryptedData.message) {
    return res.status(401).json({
      error: encryptedData.message,
      code: 'unauthorized',
    });
  }

  const isUserExists = await Models.Users.findOne({ where: { email: encryptedData.email } });

  if (!isUserExists) {
    return res.status(401).json({
      error: 'User not found. Do you have account in this beatiful api?',
      code: 'not_found',
    });
  }

  return next();
};

module.exports = {
  InsertUser,
  ValidUser,
};
