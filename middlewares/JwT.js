const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Roz seu lindo atenção no comment abaixo porfavorzinho *_*
// Eu sei que o secret NÃO fica exposto, só deixei aqui pra facilitar vc não ter que criar o .env

const jwtConfig = {
  expiresIn: '1D',
  algorithm: 'HS256',
};

const secret = process.env.SECRET || 'lipexzx';

const generateToken = (userInfo) => {
  const token = jwt.sign({ data: userInfo }, secret, jwtConfig);
  return token;
};

const loginJwt = async (req, _res, next) => {
  const { authorization: token } = req.headers;
  if (!token) {
    const err = { error: { message: 'Token not found', code: 'Invalid_data' } };
    next(err);
  }
  try {
    const validToken = jwt.verify(token, secret);
    const { data: { _id } } = validToken;
    const userExist = await User.findById(_id);
    if (!userExist) {
      const err = { error: { message: 'User does not exist', code: 'Invalid_data' } };
      next(err);
    }
    const { password, ...noPass } = userExist;
    req.user = noPass;
    return next();
  } catch (err) {
    const error = { error: { message: err.message, code: 'Unauthorized' } };
    next(error);
  }
};

// const loginUser = async (user) => {
//   const { email, password: keyPass } = user;
//   const existUser = await usersModel.findByEmail(email);
//   if (!existUser) {
//     const err = { error: { message: 'E-mail does not exist', code: 'Invalid_data' } };
//     throw err;
//   }
//   if (keyPass !== existUser.password) {
//     const err = { error: { message: 'Password does not match', code: 'Invalid_data' } };
//     throw err;
//   }
//   const { password, ...noPass } = existUser;
//   const token = jwt.sign({ data: noPass }, secret, jwtConfig);
//   return token;
// };

// const loginAdmin = async (req, _res, next) => {
//   const { authorization: token } = req.headers;
//   if (!token) {
//     const err = { error: { message: 'Token not found', code: 'Invalid_data' } };
//     next(err);
//   }
//   try {
//     const validToken = jwt.verify(token, secret);
//     const { data: { _id } } = validToken;
//     const userLogged = await usersModel.findById(_id);
//     if (userLogged.role !== 'admin') {
//       const err = { error: { message: 'You not have permission', code: 'Unauthorized' } };
//       return next(err);
//     }
//     next();
//   } catch (err) {
//     const error = { error: { message: err.message, code: 'Unauthorized' } };
//     next(error);
//   }
// };

module.exports = {
  loginJwt,
  generateToken,
};
