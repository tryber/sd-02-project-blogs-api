const { User } = require('../models');
const { checkName, checkPassword, checkEmail } = require('./utils/checkFields');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'displayName', 'email', 'image'] });
    res.status(200);
    res.json(users);
    return res;
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'displayName', 'email', 'image'],
    });
    res.status(200);
    res.json(user);
    return res;
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.user[0].dataValues;
    await User.destroy({ where: { id } });
    res.status(200);
    res.json({ message: 'User deleted' });
    return res;
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const postNewUser = async (req, res, next) => {
  const { displayName, email, password, image } = req.body;
  if (!displayName || !email || !password || !image) {
    return next({ code: 'invalid_data', message: 'Missing fields' });
  }
  if (!checkEmail(email) || !checkPassword(password) || !checkName(displayName)) {
    return next({ code: 'invalid_data', message: 'Validation error' });
  }
  try {
    const [, created] = await User.findOrCreate({
      where: { email },
      defaults: { displayName, password, image },
    });
    if (!created) return next({ code: 'invalid_data', message: 'Usuário já existe' });

    next();
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  postNewUser,
};
