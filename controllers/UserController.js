const UserService = require('../services/UserService');

async function createNewUser(req, res) {
  const { displayName, email, password, image } = req.body;

  try {
    const user = await UserService.create({ displayName, email, password, image });

    if (user.error) return res.status(user.code).json({ message: user.message });

    res.status(201).json(user);
  } catch (e) {
    console.error(e.message);

    res.status(500).json({ message: 'erro na conexão com base de dados' });
  }
}

async function getAllUsers(_req, res) {
  return UserService.getAllUsers()
    .then((users) => res.status(200).json(users))
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'erro na conexão com base de dados' });
    });
}

async function getUser(req, res) {
  const { id } = req.params;

  return UserService.getUser(id)
    .then((user) => {
      if (!user) return res.status(404).json({ message: 'usuário não encontrado' });
      res.status(200).json(user);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'erro na conexão com base de dados' });
    });
}

async function deleteUser(req, res) {
  const { id } = req.user;

  return UserService.deleteUser(id)
    .then(() => res.status(200).end())
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'erro na conexão com base de dados' });
    });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'campos inválidos' });

  return UserService.login({ email, password })
    .then((response) => {
      if (response.error) return res.status(response.code).json({ message: response.message });
      res.status(200).json(response);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: 'erro na conexão com base de dados' });
    });
}

module.exports = {
  createNewUser,
  getAllUsers,
  getUser,
  deleteUser,
  login,
};
