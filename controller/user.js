const { validate, userSchema } = require('../validate');

const postUser = async (req, res) => {
  const { image, password, ...user } = req.body;
  const { error } = await validate(userSchema, {...user, password: JSON.stringify(password)})
  console.log(error)
};

module.exports = { postUser };