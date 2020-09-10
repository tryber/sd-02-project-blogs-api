const Boom = require('@hapi/boom');

const service = require('../serviceController');

const handleError = {
  exists: () => {
    throw Boom.badRequest('Usuário já existe');
  },
  notFound: () => {
    throw Boom.badRequest('Usuário não encontrado');
  },
  wrongPassword: () => {
    throw Boom.badRequest('Senha incorreta');
  },
};

function create({ User, userModel }) {
  return async (req, res) => {
    const user = new User({
      ...req.body,
      userModel,
    });

    const { data, token, error } = await user.create();

    if (error) return handleError[error]();

    res.status(201).json({ user: data, token });
  };
}

function find({ User, userModel }) {
  return service.find({
    Domain: User,
    model: userModel,
    domainKey: 'user',
    modelkey: 'userModel',
    handleError,
  });
}

function list({ User, userModel }) {
  return async (_req, res) => {
    const users = new User({ userModel });

    const data = await users.list();

    res.status(200).json({ users: data });
  };
}

function login({ User, userModel }) {
  return async (req, res) => {
    const user = new User({ userModel, ...req.body });

    const { data, token, error } = await user.login();

    if (error) return handleError[error]();

    res.status(200).json({ user: data, token });
  };
}

function remove({ User, userModel }) {
  return service.remove({ Domain: User, model: userModel, modelkey: 'userModel' });
}

function update({ User, userModel }) {
  return service.update({
    Domain: User,
    model: userModel,
    domainKey: 'user',
    modelkey: 'userModel',
    handleError,
  });
}

module.exports = {
  create,
  find,
  list,
  login,
  remove,
  update,
};
