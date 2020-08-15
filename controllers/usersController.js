const { User } = require('../models');

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

module.exports = {
  getUsers,
  getUser,
};
