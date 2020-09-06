// const { getFieldsFilled } = require('../utils');

// async function create({ data, Model }) {
//   const blogPostModel = new Model(data);

//   return blogPostModel.create();
// }

// async function find({ id, Model }) {
//   const blogPostModel = new Model({ id });

//   const blogPost = await blogPostModel.find();

//   if (!blogPost) return { data: null, error: 'notFound' };

//   return { data: blogPost, error: null };
// }

// async function list({ Model }) {
//   const blogPostModel = new Model();

//   return blogPostModel.list();
// }

// async function search({ name, Model }) {
//   const blogPostModel = new Model();

//   return blogPostModel.findBy(name);
// }

// async function remove({ id, Model }) {
//   const blogPostModel = new Model({ id });

//   return blogPostModel.remove();
// }

// async function update({ data, Model }) {
//   const blogPostModel = new Model(data);

//   const blogPost = await blogPostModel.find();

//   if (!blogPost) return { data: null, error: 'notFound' };

//   const fields = getFieldsFilled(data);

//   return blogPostModel.update(fields);
// }

// module.exports = {
//   create,
//   find,
//   list,
//   search,
//   remove,
//   update,
// };
