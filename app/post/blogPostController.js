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
      blogPostModel,
    });

    const { data } = await blogPost.create();

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
    const blogPost = new BlogPost({ blogPostModel });

    const data = await blogPost.list();

    res.status(200).json({ blogPost: data });
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

    const { data, error } = await blogPost.search(req.query.search);

    if (error) return handleError[error]();

    res.status(200).json({ blogPost: data });
  };
}

function update({ BlogPost, blogPostModel }) {
  return async (req, res) => {
    const blogPost = new BlogPost({ blogPostModel, ...req.body, id: req.params.id });

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
