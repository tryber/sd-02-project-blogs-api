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

const validateUser = ({ displayName, email, password }) => {
  let message = '';

  if (!isDisplayNameValid(displayName)) {
    message = 'displayName deve ter pelo menos 8 caracteres. ';
  }

  if (!isEmailValid(email)) {
    message = `${message}Insira um email válido. `;
  }

  if (!isPasswordValid(password)) {
    message = `${message}A senha deve conter 6 caracteres.`;
  }

  return message
    ? { invalidData: true, message }
    : { invalidData: false };
};

module.exports = {
  isDisplayNameValid,
  isEmailValid,
  isPasswordValid,
  validateUser,
};
