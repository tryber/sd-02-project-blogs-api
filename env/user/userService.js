const {
  bcrypt: { checkString, createHash },
  getFieldsFilled,
  jsonWebToken: { signToken },
} = require('../utils');

async function create({ data, model }) {
  const hash = await createHash(data.password);

  const userModel = new model({ ...data, password: hash });

  const userExists = await userModel.findBy('email');

  if (userExists) return { data: null, error: 'exists' };

  const user = await userModel.create();

  return { data: user, error: null };
}

async function find({ id, model }) {
  const userModel = new model({ id });

  const user = await userModel.find();
  console.log(user);
  if (!user) return { data: null, error: 'notFound' };

  return { data: user, error: null };
}

async function list({ model }) {
  const userModel = new model();

  return userModel.list();
}

async function login({ email, password, model }) {
  const userModel = new model({ email, password });

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

async function remove({ id, model }) {
  const userModel = new model({ id });

  return userModel.remove();
}

async function update({ data, model }) {
  const userModel = new model({ data });

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
