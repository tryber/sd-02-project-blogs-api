const { verifyToken } = require('./Jwt');
const Models = require('../models');

const createBlogPosts = async (req, res) => {
  const { email } = verifyToken(req.headers.authorization);
  const { id } = await Models.Users.findOne({ where: { email } });

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

const getAllPosts = async (req, res) => {
  const allPosts = await Models.BlogPosts.findAll({
    attributes: ['id', 'published', 'updated', 'title', 'content'],
    include: 'User',
  });
  console.log(allPosts);
  return res.status(200)
    .json({
      status: 'Success',
      posts: allPosts,
    });
};

module.exports = {
  createBlogPosts,
  getAllPosts,
};
