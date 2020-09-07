const isDisplayNameValid = (displayName) => (
  typeof displayName === 'string'
    && displayName.length >= 8
);

const isEmailValid = (email) => {
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

  return typeof email === 'string'
    && emailRegex.test(email);
};

const isPasswordValid = (password) => (
  typeof password === 'string'
    && password.length === 6
);

const FIELDS_VALIDATION = {
  displayName: {
    validate: isDisplayNameValid,
    errorMessage: 'O campo displayName deve ter pelo menos 8 caracteres.',
  },
  email: {
    validate: isEmailValid,
    errorMessage: 'O campo email deve ter um e-mail válido.',
  },
  password: {
    validate: isPasswordValid,
    errorMessage: 'O campo password deve conter 6 caracteres.',
  },
};

const validateUser = (fieldNames, data) => {
  const errorMessages = [];

  fieldNames.forEach((fieldName, index) => {
    const { validate, errorMessage } = FIELDS_VALIDATION[fieldName];

    if (!validate(data[index])) {
      errorMessages.push(errorMessage);
    }
  });

  return errorMessages.length > 0
    ? { isValid: false, message: errorMessages.join(' ') }
    : { isValid: true };
};

module.exports = {
  validateUser,
};
