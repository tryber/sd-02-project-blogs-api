const { bcrypt, jsonWebToken } = require('../../utils');

async function create({ data, Model }) {
  const hash = await bcrypt.createHash(data.password);

  const userModel = new Model({ ...data, password: hash });

  const userExists = await userModel.findBy('email');

  if (userExists.length !== 0) return { data: null, token: null, error: 'exists' };

  const {
    dataValues: { password, ...userWithoutPassword },
  } = await userModel.create();

  const token = jsonWebToken.signToken(userWithoutPassword);

  return { data: userWithoutPassword, token, error: null };
}

async function find({ id, Model }) {
  const userModel = new Model({ id });

  const user = await userModel.find();

  if (!user) return { data: null, error: 'notFound' };

  const {
    dataValues: { password, ...userWithoutPassword },
  } = user;

  return { data: userWithoutPassword, error: null };
}

async function list({ Model }) {
  const userModel = new Model();

  const users = await userModel.list();

  return users.map(({ dataValues: { password, ...userWithoutPassword } }) => userWithoutPassword);
}

async function login({ email, password, Model }) {
  const userModel = new Model({ email, password });

  const user = await userModel.findBy('email');

  if (user.length === 0) return { data: null, token: null, error: 'notFound' };

  const {
    dataValues: { password: userPassword, ...userWithoutPassword },
  } = user[0];

  const isCorrectPassword = await bcrypt.checkString({
    string: password,
    hash: userPassword,
  });

  if (!isCorrectPassword && password !== userPassword) {
    return { data: null, token: null, error: 'wrongPassword' };
  }

  const token = jsonWebToken.signToken(userWithoutPassword);

  return { data: userWithoutPassword, token, error: null };
}

async function remove({ id, Model }) {
  const userModel = new Model({ id });

  return userModel.remove();
}

async function update({ data, id, Model }) {
  const userModel = new Model({ id, ...data });

  const userExists = await userModel.find();

  if (!userExists) return { data: null, error: 'notFound' };

  await userModel.update();

  const {
    dataValues: { password, ...userWithoutPassword },
  } = await userModel.find();

  return { data: userWithoutPassword, error: null };
}

module.exports = {
  create,
  find,
  list,
  login,
  remove,
  update,
};
