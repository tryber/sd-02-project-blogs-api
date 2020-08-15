const validateJoi = async (schema, obj) => {
  const val = await schema.validateAsync(obj).catch((err) => {
    const error = { error: { message: err.details[0].message, code: 'Invalid_data' } };
    throw error;
  });
  return val;
};

module.exports = validateJoi;
