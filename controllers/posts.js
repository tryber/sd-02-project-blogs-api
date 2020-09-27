const { posts } = require('../services');
const { notFound, badData, exists, badRequest } = require('../middlewares/error');

const checkIntegrity = (title, content) => title.length !== 0 || content.length !== 0;

const createPost = async (req, res, _next) => {
  const { dataValues: { id } } = req.user;
  const { title, content } = req.body;
  try {
    if (!checkIntegrity(title, content)) { throw badData; }
    const newPost = await posts.createPost({ title, content, userId: id });
    return res.status(200).json(newPost);
  } catch (err) {
    console.log('error from controller.createPost:', err);
  }
};

const listPosts = async (_req, res) => {
  try {
    const postsList = await posts.listPosts();
    return res.status(200).json(postsList);
  } catch (err) {
    console.log('error from controller.listPosts:', err);
  }
};

module.exports = {
  createPost,
  listPosts,
};

