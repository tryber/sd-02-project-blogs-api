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

async function updatePost(req, res) {
  const { title, content } = req.body;
  const { id: postId } = req.params;
  const { id: userId } = req.user;

  const validFields = fieldsCheck({ title, content });

  if (!validFields) {
    return res
      .status(400)
      .json({ message: 'sua requisição deve conter um title e um content e devem ser strings' });
  }

  try {
    const response = await PostService.updatePost({ title, content, postId, userId });
    if (response.error) return res.status(response.code).json({ message: response.message });
    res.status(200).json({ message: 'Post atualizado com sucesso' });
  } catch (e) {
    console.error(e.message);

    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
}

async function getSinglePost(req, res) {
  const { id } = req.params;

  return PostService.getSinglePost({ id })
    .then((result) => res.status(200).json(result))
    .catch((e) => {
      console.error(e.message);
      res.status(500).json({ message: 'erro na conexão com base de dados' });
    });
}

async function searchPosts(req, res) {
  const { q: searchTerm } = req.query;

  try {
    const result = await PostService.searchPosts({ searchTerm });
    res.status(200).json(result);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
}

module.exports = {
  createNewPost,
  getAllPosts,
  updatePost,
  searchPosts,
  getSinglePost,
};
