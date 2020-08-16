const { Post } = require('../models');

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

module.exports = {
  postPost,
  updatePost,
};
