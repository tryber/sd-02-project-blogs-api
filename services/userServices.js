const Models = require('../models');
const { searchUser } = require('./searchUser');
const { newToken } = require('./Jwt');

const userLogin = async (req, res) => {
  const isExistsUser = await searchUser(req.body.email);
  if (isExistsUser) {
    console.log(isExistsUser);
    return res.status(409).json({
      message: 'Usuário já existe',
    });
  }

  await Models.Users.create({ ...req.body });

  return res.status(201).json({
    token: newToken(req.body),
  });
};

module.exports = {
  userLogin,
};
