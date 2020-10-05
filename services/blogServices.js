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

const editPost = async (req, res) => {
  const post = await Models.BlogPosts.findOne({ where: { id: req.params.id } });

  if (!post) {
    return res.status(404).json({
      message: 'Post não encontrado. Mandou o ID certo?',
      code: 'not_found',
    });
  }

  const { email } = verifyToken(req.headers.authorization);

  const userData = await Models.Users.findOne({ where: { email } });

  if (userData.id !== post.userId) {
    return res.status(403).json({
      message: 'Esse post não é seu. Não é bonito mexer nas coisas dos outros.',
      code: 'Forbidden',
    });
  }

  const { title, description } = req.body;

  await Models.BlogPosts.update(
    { title, description },
    { where: { id: req.params.id } },
  );

  const updatedPost = await Models.BlogPosts.findOne({ where: { id: req.params.id } });

  return res.status(200).json({
    message: 'Success',
    post: updatedPost,
  });
};

module.exports = {
  createBlogPosts,
  getAllPosts,
  editPost,
};
