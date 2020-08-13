const errorJoi = (err) => {
  if (err.details) {
    return {
      error: true,
      message: err.details[0].message,
      code: 'invalid_data',
    };
  }
  return err;
};
const validateJoi = async (schema, reqInfo) =>
  schema.validateAsync(reqInfo).catch((fail) => errorJoi(fail));

module.exports = validateJoi;
