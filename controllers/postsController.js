const { Op } = require('sequelize');
const { Post, User } = require('../models');

const postPost = async (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) return next({ code: 'unauthorized', message: 'Missing fields' });
  try {
    await Post.create({ content, title, user_id: req.user[0].id });

    res.status(200);
    res.json({ message: 'Post created' });
    return res;
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const updatePost = async (req, res, next) => {
  const { title, content } = req.body;
  const { id } = req.params;
  if (!title || !content) return next({ code: 'unauthorized', message: 'Missing fields' });
  try {
    const [updated] = await Post.update(
      { title, content },
      {
        where: {
          id,
          user_id: req.user[0].id,
        },
      },
    );
    if (!updated) return next({ code: 'access_denied', message: 'Not allowed' });
    res.status(200);
    res.json({ message: 'Post updated' });
    return res;
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const { id: userReqId } = req.user[0];
  try {
    const post = await Post.findByPk(id);
    if (!post) return next({ code: 'not_found', message: 'Post not found' });
    const { user_id: userId } = post;
    if (userId !== userReqId) return next({ code: 'access_denied', message: 'User not allowed' });
    await Post.destroy({ where: { id } });
    res.status(200);
    res.json({ message: 'Post deleted' });
    return res;
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const getAllPosts = async (_req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password'],
        },
      },
    });
    res.status(200);
    res.json(posts);
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password'],
        },
      },
    });
    if (!post) return next({ code: 'not_found', message: 'Post not found' });
    res.status(200);
    res.json(post);
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

const getByText = async (req, res, next) => {
  try {
    const { q } = req.query;
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { content: { [Op.like]: `%${q}%` } },
        ],
      },
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['password'],
        },
      },
    });
    res.status(200);
    res.json(posts);
  } catch (error) {
    next({ code: 'something_wrong', message: 'Something went wrong' });
  }
};

module.exports = {
  postPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPost,
  getByText,
};
