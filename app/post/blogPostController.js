const Boom = require('@hapi/boom');

const service = require('../serviceController');

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
  return service.find({
    Domain: BlogPost,
    model: blogPostModel,
    domainKey: 'blogPost',
    modelkey: 'blogPostModel',
    handleError,
  });
}

function list({ BlogPost, blogPostModel }) {
  return async (_req, res) => {
    const blogPosts = new BlogPost({ blogPostModel });

    const data = await blogPosts.list();

    res.status(200).json({ blogPosts: data });
  };
}

function remove({ BlogPost, blogPostModel }) {
  return service.remove({ Domain: BlogPost, model: blogPostModel, modelkey: 'blogPostModel' });
}

function search({ BlogPost, blogPostModel }) {
  return async (req, res) => {
    const blogPost = new BlogPost({ blogPostModel });

    const { data, error } = await blogPost.search(req.query.q);

    if (error) return handleError[error]();

    res.status(200).json({ blogPosts: data });
  };
}

function update({ BlogPost, blogPostModel }) {
  return service.update({
    Domain: BlogPost,
    model: blogPostModel,
    domainKey: 'blogPost',
    modelkey: 'blogPostModel',
    handleError,
  });
}

module.exports = {
  create,
  find,
  list,
  remove,
  search,
  update,
};
