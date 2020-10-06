const rescue = require('express-rescue');
const { getOnePost } = require('../service/blogService');

const objectError = {
  forbidden: () => ({ message: 'Atualização proibida', code: 'forbidden' }),
  notFound: () => ({ message: 'Postagem não encontrada', code: 'not_found' }),
};

const confirmUser = rescue(async (req, _res, next) => {
  const { id } = req.params;
  const result = await getOnePost(id);
  if (!result) return next(objectError.notFound());
  if (req.user.id !== result.dataValues.user.dataValues.id) {
    return next(objectError.forbidden());
  }
  return next();
});

module.exports = confirmUser;
