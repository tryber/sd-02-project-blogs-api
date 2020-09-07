async function create({ data, Model }) {
  const blogPostModel = new Model(data);

  return blogPostModel.create();
}

async function find({ id, Model }) {
  const blogPostModel = new Model({ id });

  const blogPost = await blogPostModel.find();

  if (!blogPost) return { data: null, error: 'notFound' };

  return { data: blogPost, error: null };
}

async function list({ Model }) {
  const blogPostModel = new Model();

  return blogPostModel.list();
}

async function search({ name, Model }) {
  const blogPostModel = new Model();

  const blogPost = await blogPostModel.findBy(name);

  if (blogPost.length === 0) return { data: null, error: 'notFound' };

  return { data: blogPost, error: null };
}

async function remove({ id, Model }) {
  const blogPostModel = new Model({ id });

  return blogPostModel.remove();
}

async function update({ data, id, Model }) {
  const blogPostModel = new Model({ id, ...data });

  const blogPostExists = await blogPostModel.find();

  if (!blogPostExists) return { data: null, error: 'notFound' };

  await blogPostModel.update();

  return { data: await blogPostModel.find(), error: null };
}

module.exports = {
  create,
  find,
  list,
  search,
  remove,
  update,
};
