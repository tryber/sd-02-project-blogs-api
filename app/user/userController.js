const Boom = require('@hapi/boom');

const handleError = {
  exists: () => {
    throw Boom.badRequest('Usuário já existe');
  },
  notFound: () => {
    throw Boom.badRequest('Usuário não encontrado');
  },
};

function create({ User, userModel }) {
  return async (req, res) => {
    const user = new User({
      data: req.body,
      userModel,
    });

    const { data, token, error } = await user.create();

    if (error) return handleError[error]('user');

    res.status(201).json({ user: data, token });
  };
}

function find({ User, userModel }) {
  return async (req, res) => {
    const user = new User({ userModel });
  };
}

function list({ User, userModel }) {
  return async (req, res) => {
    const user = new User({ userModel });
  };
}

function login({ User, userModel }) {
  return async (req, res) => {
    const user = new User({ userModel });
  };
}

function remove({ User, userModel }) {
  return async (req, res) => {
    const user = new User({ userModel });
  };
}

function update({ User, userModel }) {
  return async (req, res) => {
    const user = new User({ userModel });
  };
}

module.exports = {
  create,
  find,
  list,
  login,
  remove,
  update,
};
