const { getFieldsFilled } = require('../utils');

async function create({ data, model }) {
  const blogPostModel = new model(data);

  return blogPostModel.create();
}

async function find({ id, model }) {
  const blogPostModel = new model({ id });

  const blogPost = await blogPostModel.find();

  if (!blogPost) return { data: null, error: 'notFound' };

  return { data: blogPost, error: null };
}

async function list({ model }) {
  const blogPostModel = new model();

  return blogPostModel.list();
}

async function search({ name, model }) {
  const blogPostModel = new model();

  return blogPostModel.findBy(name);
}

async function remove({ id, model }) {
  const blogPostModel = new model({ id });

  return blogPostModel.remove();
}

async function update({ data, model }) {
  const blogPostModel = new model({ data });

  const blogPost = await blogPostModel.find();

  if (!blogPost) return { data: null, error: 'notFound' };

  const fields = getFieldsFilled(data);

  return blogPostModel.update(fields);
}

module.exports = {
  create,
  find,
  list,
  search,
  remove,
  update,
};
