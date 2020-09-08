const jwt = require('jsonwebtoken');
const authMiddleware = require('./auth');
const { User } = require('../models');

test('Sem token, retorna erro com status 401', async () => {
  const mockReq = {
    headers: { authorization: '' },
  };

  const mockJson = jest.fn();
  const mockRes = {
    status: jest
      .fn()
      .mockReturnValueOnce({ json: mockJson }),
  };

  const mockNext = jest.fn();

  const mockData = {
    message: 'Um token é necessário',
  };

  await authMiddleware(mockReq, mockRes, mockNext);

  expect(mockRes.status).toBeCalledWith(401);
  expect(mockJson).toBeCalledWith(mockData);
  expect(mockNext).toBeCalledTimes(0);
});

test('Se o token não é verificado, retorna erro com status 401', async () => {
  const mockReq = {
    headers: {
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRpc3BsYXlOYW1lIjoiYWFhYWFhYWFhYWFhYWFhYSIsImVtYWlsIjoibWlndWVsaXRvQG1pZ3VlbC5jb20iLCJpbWFnZSI6bnVsbCwiaWF0IjoxNTk5NTI0MTI4LCJleHAiOjE2MDIxMTYxMjh9.nlPWOxXYZEPXM_4liwoQ0MZ1r070y1XLtvA2_30wlcE',
    },
  };

  const mockJson = jest.fn();
  const mockRes = {
    status: jest
      .fn()
      .mockReturnValueOnce({ json: mockJson }),
  };

  const mockNext = jest.fn();

  const verifySpy = jest
    .spyOn(jwt, 'verify')
    .mockImplementationOnce(() => {
      throw Error();
    });

  await authMiddleware(mockReq, mockRes, mockNext);

  expect(verifySpy).toBeCalledTimes(1);
  expect(mockRes.status).toBeCalledWith(401);
  expect(mockJson).toBeCalledWith({ message: 'Token inválido ou expirado' });
  expect(mockNext).toBeCalledTimes(0);

  verifySpy.mockRestore();
});

test('Se o usuário do token não é encontrado, retorna erro com status 401', async () => {
  const mockReq = {
    headers: {
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRpc3BsYXlOYW1lIjoiYWFhYWFhYWFhYWFhYWFhYSIsImVtYWlsIjoibWlndWVsaXRvQG1pZ3VlbC5jb20iLCJpbWFnZSI6bnVsbCwiaWF0IjoxNTk5NTI0MTI4LCJleHAiOjE2MDIxMTYxMjh9.nlPWOxXYZEPXM_4liwoQ0MZ1r070y1XLtvA2_30wlcE',
    },
  };

  const mockJson = jest.fn();
  const mockRes = {
    status: jest
      .fn()
      .mockReturnValueOnce({ json: mockJson }),
  };

  const mockNext = jest.fn();

  const mockData = {
    id: 17,
    displayName: 'aaaaaaaaaaaaaaaa',
    email: 'miguelito@miguel.com',
    image: null,
    iat: 1599524128,
    exp: 1602116128,
  };

  const verifySpy = jest
    .spyOn(jwt, 'verify')
    .mockReturnValueOnce(mockData);

  const findByPkSpy = jest
    .spyOn(User, 'findByPk')
    .mockReturnValueOnce(null);

  await authMiddleware(mockReq, mockRes, mockNext);

  expect(verifySpy).toBeCalledTimes(1);
  expect(findByPkSpy).toBeCalledTimes(1);
  expect(mockReq.user).toStrictEqual(undefined);
  expect(mockRes.status).toBeCalledWith(401);
  expect(mockJson).toBeCalledWith({ message: 'Usuário do token não encontrado' });
  expect(mockNext).toBeCalledTimes(0);

  verifySpy.mockRestore();
  findByPkSpy.mockRestore();
});

test('Se o usuário do token é encontrado, chama a função next', async () => {
  const mockReq = {
    headers: {
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImRpc3BsYXlOYW1lIjoiYWFhYWFhYWFhYWFhYWFhYSIsImVtYWlsIjoibWlndWVsaXRvQG1pZ3VlbC5jb20iLCJpbWFnZSI6bnVsbCwiaWF0IjoxNTk5NTI0MTI4LCJleHAiOjE2MDIxMTYxMjh9.nlPWOxXYZEPXM_4liwoQ0MZ1r070y1XLtvA2_30wlcE',
    },
  };

  const mockJson = jest.fn();
  const mockRes = {
    status: jest
      .fn()
      .mockReturnValueOnce({ json: mockJson }),
  };

  const mockNext = jest.fn();

  const mockData = {
    id: 17,
    displayName: 'aaaaaaaaaaaaaaaa',
    email: 'miguelito@miguel.com',
    image: null,
    iat: 1599524128,
    exp: 1602116128,
  };

  const mockUser = {
    id: 17,
    displayName: 'aaaaaaaaaaaaaaaa',
    email: 'miguelito@miguel.com',
    image: null,
  };

  const verifySpy = jest
    .spyOn(jwt, 'verify')
    .mockReturnValueOnce(mockData);

  const findByPkSpy = jest
    .spyOn(User, 'findByPk')
    .mockReturnValueOnce(mockUser);

  await authMiddleware(mockReq, mockRes, mockNext);

  expect(verifySpy).toBeCalledTimes(1);
  expect(findByPkSpy).toBeCalledTimes(1);
  expect(mockReq.user).toStrictEqual(mockUser);
  expect(mockRes.status).toBeCalledTimes(0);
  expect(mockJson).toBeCalledTimes(0);
  expect(mockNext).toBeCalledTimes(1);

  verifySpy.mockRestore();
  findByPkSpy.mockRestore();
});
