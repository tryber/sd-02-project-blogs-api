 const JoiError = (err) => {
  if (err.details) {
    return { error: { message: err.details[0].message } };
  }
  return err;
};

module.exports = JoiError;
