const {
  bcrypt: { checkString, createHash },
  getFieldsFilled,
  jsonWebToken: { signToken },
} = require('../utils');

async function create({ data, Model }) {
  const hash = await createHash(data.password);

  const userModel = new Model({ ...data, password: hash });

  const userExists = await userModel.findBy('email');

  if (userExists) return { data: null, error: 'exists' };

  const user = await userModel.create();

  return { data: user, error: null };
}

async function find({ id, Model }) {
  const userModel = new Model({ id });

  const user = await userModel.find();
  console.log(user);
  if (!user) return { data: null, error: 'notFound' };

  return { data: user, error: null };
}

async function list({ Model }) {
  const userModel = new Model();

  return userModel.list();
}

async function login({ email, password, Model }) {
  const userModel = new Model({ email, password });

  const user = await userModel.find('email');

  if (!user) return { data: null, token: null, error: 'notFound' };

  const { password: userPassword, ...userWithoutPassword } = user;

  const isCorrectPassword = await checkString({
    string: password,
    hash: userPassword,
  });

  if (!isCorrectPassword) return { data: null, token: null, error: 'wrongPassword' };

  const token = signToken(userWithoutPassword);

  return { data: userWithoutPassword, token, error: null };
}

async function remove({ id, Model }) {
  const userModel = new Model({ id });

  return userModel.remove();
}

async function update({ data, Model }) {
  const userModel = new Model(data);

  const user = await userModel.find();

  if (!user) return { data: null, error: 'notFound' };

  const fields = getFieldsFilled(data);

  return userModel.update(fields);
}

module.exports = {
  create,
  find,
  list,
  login,
  remove,
  update,
};
