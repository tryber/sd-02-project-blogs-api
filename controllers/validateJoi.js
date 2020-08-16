const errorJoi = (err) => ({
  error: true, message: err.details[0].message, code: 'bad_request',
});

const validateJoi = async (schema, reqInfo) =>
  schema.validateAsync(reqInfo).catch((fail) => errorJoi(fail));

module.exports = validateJoi;
