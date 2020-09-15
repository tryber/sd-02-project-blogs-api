const { UserSchema, PostSchema } = require('../services');

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

module.exports = {
  InsertUser,
};
