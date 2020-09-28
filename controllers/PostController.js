const PostService = require('../services/PostService');

const fieldsCheck = ({ title, content }) => {
  const isString = typeof title === 'string' && typeof content === 'string';
  const exists = title && content;

  return isString && exists;
};

async function createNewPost(req, res) {
  const { title, content } = req.body;
  const { id: userId } = req.user;

  const validFields = fieldsCheck({ title, content });

  if (!validFields) {
    return res
      .status(400)
      .json({ message: 'sua requisição deve conter um title e um content e devem ser strings' });
  }

  try {
    const post = await PostService.create({ title, content, userId });

    res.status(201).json(post);
  } catch (e) {
    console.error(e.message);

    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
}

async function getAllPosts(_req, res) {
  return PostService.getAllPosts()
    .then((posts) => res.status(200).json(posts))
    .catch((e) => {
      console.error(e.message);
      res.status(500).json({ message: 'erro na conexão com base de dados' });
    });
}

module.exports = {
  createNewPost,
  getAllPosts,
};
