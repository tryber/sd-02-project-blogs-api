const { users } = require('../services');

const checkIntegrity = (displayName, email, password) => {
  const mailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  return typeof displayName === 'string' && displayName.length !== 0 && typeof email === 'string' && mailRegex.test(email) && typeof password === 'string' && password.length === 6;
};

const createUser = async (req, res) => {
  const { displayName, email, password, image = 'xablau.jpg' } = req.body;
  try {
    if (!checkIntegrity(displayName, email, password)) {
      return res.status(400).json({ code: 400, message: 'Bad request' });
    }
    const newUser = await users.createUser({ displayName, email, password, image });
    if (newUser === 409) {
      return res.status(409).json({ code: 409, message: 'User already exists' });
    }
    const serviceAnswer = await users.loginUser({ email, password });
    return res.status(201).json({ token: serviceAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
};

const list = async (_req, res) => {
  try {
    const listUsers = await users.list();
    return res.status(200).json({ users: listUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
};

const listOne = async (req, res) => {
  const { id } = req.params;
  try {
    const listUser = await users.listOne(id);
    if (listUser === 404) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }
    return res.status(200).json(listUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.user;
  try {
    await users.deleteUser(id);
    return res.status(200).json({ code: 200, message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const serviceAnswer = await users.loginUser({ email, password });
    if (serviceAnswer === 404) {
      return res.status(404).json({ code: 404, message: 'User not found' });
    }
    if (serviceAnswer === 400) {
      return res.status(400).json({ code: 400, message: 'Bad request' });
    }
    return res.status(201).json({ token: serviceAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
};

module.exports = {
  createUser,
  list,
  listOne,
  deleteUser,
  loginUser,
};
