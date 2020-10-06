const { Op } = require('sequelize');
const { verifyToken } = require('./Jwt');
const Models = require('../models');

const getAllDbPosts = async () =>
  Models.BlogPosts.findAll({
    attributes: ['id', 'published', 'updated', 'title', 'content'],
    include: [
      {
        model: Models.Users,
        as: 'User',
        attributes: ['id', 'displayName', 'email', 'image'],
      },
    ],
  });

const getOnePost = async (param) =>
  Models.BlogPosts.findOne({
    attributes: ['id', 'published', 'updated', 'title', 'content'],
    include: [
      {
        model: Models.Users,
        as: 'User',
        attributes: ['id', 'displayName', 'email', 'image'],
      },
    ],
    where: { id: param },
  });

const createBlogPosts = async (req, res) => {
  const { email } = verifyToken(req.headers.authorization);
  const userData = await Models.Users.findOne({ where: { email } });

  const postStructure = {
    userId: userData.id,
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

const getAllPosts = async (_req, res) => {
  const allPosts = await getAllDbPosts();

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

  const userToken = verifyToken(req.headers.authorization);

  const userData = await Models.Users.findOne({ where: { email: userToken.email } });

  if (userData.id !== post.userId) {
    return res.status(403).json({
      message: 'Esse post não é seu. Não é bonito mexer nas coisas dos outros.',
      code: 'Forbidden',
    });
  }

  const { title, content } = req.body;

  await Models.BlogPosts.update(
    { title, content },
    { where: { id: req.params.id } },
  );

  const updatedPost = await Models.BlogPosts.findOne({ where: { id: req.params.id } });

  return res.status(200).json({
    message: 'Success',
    post: updatedPost,
  });
};

const getPost = async (req, res) => {
  const post = await getOnePost(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: 'Post não encontrado. Mandou o ID certo?',
      code: 'not_found',
    });
  }

  return res.status(200).json({
    message: 'Success',
    post,
  });
};

const searchPost = async (req, res) => {
  const searchWord = `%${req.query.q}%`;

  const getPostsLike = await Models.BlogPosts.findAll({
    attributes: ['id', 'published', 'updated', 'title', 'content'],
    include: {
      model: Models.Users,
      as: 'User',
      attributes: ['id', 'displayName', 'email', 'image'],
    },
    where: {
      [Op.or]: [
        {
          title: { [Op.like]: searchWord },
        },
        {
          content: { [Op.like]: searchWord },
        },
      ],
    },
  });

  return res.status(200).json({
    status: 'Success',
    search: getPostsLike,
  });
};

const deletePost = async (req, res) => {
  const post = await getOnePost(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: 'Post não encontrado',
      code: 'not_found',
    });
  }

  const userData = verifyToken(req.headers.authorization);
  if (userData.email !== post.User.email) {
    return res.status(403).json({
      message: 'Esse post é do amiguinho. N pode apagar.',
      code: 'Forbidden',
    });
  }

  await post.destroy();

  return res.status(200).json({
    message: 'Apagado',
  });
};

module.exports = {
  createBlogPosts,
  getAllPosts,
  searchPost,
  deletePost,
  editPost,
  getPost,
};
