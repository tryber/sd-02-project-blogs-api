const { Post } = require('../models');

const getUser = async (req, res) => {
  const users = await Post.findAll();
  res.status(200).json(users);
};

module.exports = {
  getUser,
};
