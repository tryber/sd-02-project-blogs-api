const Boom = require('@hapi/boom');

const handleError = {
  notFound: () => {
    throw Boom.badRequest('Post não encontrado');
  },
};

function create({ BlogPost, blogPostModel }) {
  return async (req, res) => {
    const blogPost = new BlogPost({
      ...req.body,
      user_id: req.user.id,
      blogPostModel,
    });

    const data = await blogPost.create();

    res.status(201).json({ blogPost: data });
  };
}

function find({ BlogPost, blogPostModel }) {
  return async (req, res) => {
    const blogPost = new BlogPost({ blogPostModel, id: req.params.id });

    const { data, error } = await blogPost.find();

    if (error) return handleError[error]();

    res.status(200).json({ blogPost: data });
  };
}

function list({ BlogPost, blogPostModel }) {
  return async (_req, res) => {
    const blogPosts = new BlogPost({ blogPostModel });

    const data = await blogPosts.list();

    res.status(200).json({ blogPosts: data });
  };
}

function remove({ BlogPost, blogPostModel }) {
  return async (req, res) => {
    const blogPost = new BlogPost({ blogPostModel, id: req.params.id });

    await blogPost.remove();

    res.status(204).end();
  };
}

function search({ BlogPost, blogPostModel }) {
  return async (req, res) => {
    const blogPost = new BlogPost({ blogPostModel });

    const { data, error } = await blogPost.search(req.query.q);

    if (error) return handleError[error]();

    res.status(200).json({ blogPost: data });
  };
}

function update({ BlogPost, blogPostModel }) {
  return async (req, res) => {
    const blogPost = new BlogPost({ blogPostModel, ...req.body, id: req.params.id || req.user.id });

    const { data, error } = await blogPost.update();

    if (error) return handleError[error]();

    res.status(200).json({ blogPost: data });
  };
}

module.exports = {
  create,
  find,
  list,
  remove,
  search,
  update,
};
