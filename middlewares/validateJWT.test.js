const jwt = require('jsonwebtoken');
const validateJWT = require('./validateJWT');
const { User } = require('../models');

describe('validate with JWT tests', () => {
  test('if validator returns message when token is not provided', async () => {
    const mockReq = { headers: { authorization: null } };
    const mockNext = jest.fn();
    const mockAnswer = { error: true, message: 'Token não encontrado', code: 'unauthorized' };

    await validateJWT(mockReq, null, mockNext);

    expect(mockNext).toBeCalledWith(mockAnswer);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('if validator returns message when token is expired', async () => {
    const jwtSecret = 'senhaParaTeste';
    const jwtConfig = { expiresIn: '300m', algorithm: 'HS256' };
    const userData = {
      id: 100, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
    };
    const token = jwt.sign(userData, jwtSecret, jwtConfig);
    const mockReq = { headers: { authorization: token } };
    const mockNext = jest.fn();
    const mockAnswer = { error: true, message: 'Token expirado ou inválido', code: 'unauthorized' };

    await validateJWT(mockReq, null, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toBeCalledWith(mockAnswer);
  });

  test('if validator returns message when token is OK and user not found', async () => {
    const jwtSecret = 'senhaParaTeste';
    const jwtConfig = { expiresIn: '300m', algorithm: 'HS256' };
    const userData = {
      id: 100, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
    };

    const decodeData = {
      id: 100, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null, iat: 1597464316, exp: 1597482316,
    };
    const token = jwt.sign(userData, jwtSecret, jwtConfig);

    const mockReq = { headers: { authorization: token } };
    const mockNext = jest.fn();
    const mockAnswer = { error: true, message: 'Usuário não encontrado', code: 'unauthorized' };
    const getUserByIdSpy = jest.spyOn(User, 'findByPk').mockReturnValueOnce(null);
    const decode = jest.spyOn(jwt, 'verify').mockReturnValueOnce(decodeData);

    await validateJWT(mockReq, null, mockNext);

    expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
    expect(getUserByIdSpy).toBeCalledWith(userData.id);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toBeCalledWith(mockAnswer);

    getUserByIdSpy.mockRestore();
    decode.mockRestore();
  });

  test('if validator returns token when token is OK and user is found', async () => {
    const jwtSecret = 'senhaParaTeste';
    const jwtConfig = { expiresIn: '300m', algorithm: 'HS256' };
    const userData = {
      id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
    };
    const decodeData = {
      id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null, iat: 1597464316, exp: 1597482316,
    };
    const token = jwt.sign(userData, jwtSecret, jwtConfig);
    const mockReq = { headers: { authorization: token } };
    const mockNext = jest.fn();
    const mockSequelize = { dataValues: userData, ...userData };
    const getUserByIdSpy = jest.spyOn(User, 'findByPk').mockReturnValueOnce(mockSequelize);
    const decode = jest.spyOn(jwt, 'verify').mockReturnValueOnce(decodeData);

    await validateJWT(mockReq, null, mockNext);

    expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
    expect(getUserByIdSpy).toBeCalledWith(userData.id);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toBeCalledWith();

    getUserByIdSpy.mockRestore();
    decode.mockRestore();
  });
});
