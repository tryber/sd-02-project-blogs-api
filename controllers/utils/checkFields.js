const checkName = (name) => (name.length > 7);

const checkPassword = (numb) => numb.length === 6;

const checkEmail = (email) => {
  const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.?$/;
  return regex.test(email);
};

module.exports = {
  checkName,
  checkPassword,
  checkEmail,
};
