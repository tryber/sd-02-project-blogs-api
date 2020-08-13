const { Users } = require('../models');
const { createToken } = require('../utils/jwt');

const findByEmail = async (email) => Users.findOne({ where: { email } });

const postUser = async ({ displayName, email, password, image }) => {
  const data = await findByEmail(email);
  if (data) return;
  await Users.create({ displayName, email, password, image });
  const token = createToken({ displayName, email });
  return { token };
};

module.exports = {
  postUser,
}