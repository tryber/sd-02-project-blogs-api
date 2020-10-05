const { verifyToken } = require('./Jwt');
const Models = require('../models');

const createBlogPosts = async (req, res) => {
  const { email } = verifyToken(req.headers.authorization);
  const { id } = Models.Users.findOne({ where: { email } });

  const postStructure = {
    userId: id,
    title: req.body.title,
    content: req.body.content,
    published: new Date(),
    updated: new Date(),
  };

  await Models.BlogPosts.create(postStructure);

  return res.status(201).json({
    message: 'Created',
    post: postStructure,
  });
};

module.exports = {
  createBlogPosts,
};
