const { posts } = require('../services');

const notFound = (res) => res.status(404).json({ message: 'Post not found' });

const createPost = async (req, res, _next) => {
  const { dataValues: { id } } = req.user;
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Bad Request' });
    }
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

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const updatedPost = await posts.updatePost({ id, title, content, userId });
    if (updatedPost === 403) {
      return res.status(403).json({ message: 'User unauthorized to update post' });
    }
    return res.status(200).json({ message: 'Post Updated!' });
  } catch (err) {
    console.log('error from controller.updatePost:', err);
  }
};

const listPost = async (req, res) => {
  const { id } = req.params;
  try {
    const singlePost = await posts.listPost({ id });
    return singlePost === 404
      ? notFound(res)
      : res.status(200).json(singlePost);
  } catch (err) {
    console.log('error from controller.listPost:', err);
  }
};

const searchPost = async (req, res) => {
  const { q } = req.query;
  try {
    const postSearch = await posts.searchPost({ q });
    if (postSearch === 404) { return notFound(res); }
    return res.status(200).json(postSearch);
  } catch (err) {
    console.log('error from controller.searchPost:', err);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const deletedPost = await posts.deletePost({ id, userId });
    if (deletedPost === 403) {
      return res.status(403).json({ message: 'User unauthorized to delete post' });
    }
    return res.status(200).json({ message: 'Post Deleted!' });
  } catch (err) {
    console.log('error from controller.deletePost:', err);
  }
};

module.exports = {
  createPost,
  listPosts,
  updatePost,
  listPost,
  searchPost,
  deletePost,
};
