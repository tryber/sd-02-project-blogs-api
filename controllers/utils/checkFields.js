const nameOk = (name) => (name.length > 7);

const passOk = (numb) => numb.length === 6;

const emailOk = (email) => {
  const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.?$/;
  return regex.test(email);
};

const checkFields = (email, pass, name) => passOk(pass) && nameOk(name) && emailOk(email);

module.exports = {
  checkFields,
  nameOk,
  passOk,
  emailOk,
};
