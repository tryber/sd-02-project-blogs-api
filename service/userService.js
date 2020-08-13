const { Users } = require('../models');
const { createToken } = require('../utils/jwt');

const findBy = async (param, camps) => Users.findOne({ where: { ...param } }, { attributes: { exclude: [...camps] } });

const postUser = async ({ displayName, email, password, image }) => {
  const data = await findBy({ email }, []);
  if (data) return;

  const { dataValues } = await Users.create({ displayName, email, password, image });

  const token = createToken({ displayName, email, id: dataValues.id });
  return { token };
};

const getAllUsers = async () => Users.findAll({ attributes: { exclude: ['password'] } });

module.exports = {
  postUser,
  getAllUsers,
  findBy,
}