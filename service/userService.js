const { Users } = require('../models');
const { createToken } = require('../utils/jwt');

const findBy = async (param, camps) => Users
  .findOne({ where: { ...param }, attributes: { exclude: [...camps] } });

const postUser = async ({ displayName, email, password, image }) => {
  const data = await findBy({ email }, []);
  if (data) return;

  const { dataValues } = await Users.create({ displayName, email, password, image });

  const token = createToken({ displayName, email, id: dataValues.id });
  return { token };
};

const getAllUsers = async () => Users.findAll({ attributes: { exclude: ['password'] } });

const getOneUser = async (id) => findBy({ id }, ['password']);

const deleteOneUser = async (id) => Users.destroy({ where: { id } });

const login = async ({ email: emailReceived, password }) => {
  const user = await findBy({ email: emailReceived }, []);
  if (!user) return false;
  if (user.dataValues.password === password) {
    const { displayName, email, id } = user;
    return createToken({ displayName, email, id });
  }
};

module.exports = {
  postUser,
  getAllUsers,
  findBy,
  getOneUser,
  deleteOneUser,
  login,
};
