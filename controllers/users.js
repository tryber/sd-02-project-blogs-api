const { users } = require('../services');

const checkIntegrity = (displayName, email, password) => {
  const mailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  return typeof displayName === 'string' && displayName.length !== 0 && typeof email === 'string' && mailRegex.test(email) && typeof password === 'string' && password.length !== 0;
};

const createUser = async (req, res, _next) => {
  const { displayName, email, password, image = 'xablau.jpg' } = req.body;
  try {
    if (!checkIntegrity(displayName, email, password)) {
      return res.status(400).json({ message: 'Bad request' });
    }
    const newUser = await users.createUser({ displayName, email, password, image });
    if (newUser === 409) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const serviceAnswer = await users.loginUser({ email, password });
    return res.status(201).json({ token: serviceAnswer });
  } catch (err) {
    console.log('error from controller.createUser:', err);
  }
};

const list = async (_req, res) => {
  try {
    const listUsers = await users.list();
    return res.status(200).json({ users: listUsers });
  } catch (err) {
    console.log('error from controller.list:', err);
  }
};

const listOne = async (req, res) => {
  const { id } = req.params;
  try {
    const listUser = await users.listOne(id);
    if (listUser === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ listUser });
  } catch (err) {
    console.log('error from controller.listOne:', err);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.user;
  try {
    await users.deleteUser(id);
    return res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.log('error from controller.deleteUser:', err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const serviceAnswer = await users.loginUser({ email, password });
    if (serviceAnswer === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (serviceAnswer === 400) {
      return res.status(400).json({ message: 'Bad request' });
    }
    return res.status(201).json({ token: serviceAnswer });
  } catch (err) {
    console.log('error from controller.loginUser:', err);
  }
};

module.exports = {
  createUser,
  list,
  listOne,
  deleteUser,
  loginUser,
};
