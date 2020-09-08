const jwt = require('jsonwebtoken');
const authMiddleware = require('./auth');

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

test('Se o token é verificado, chama a função next', async () => {
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

  await authMiddleware(mockReq, mockRes, mockNext);

  expect(verifySpy).toBeCalledTimes(1);
  expect(mockReq.user).toStrictEqual(mockUser);
  expect(mockRes.status).toBeCalledTimes(0);
  expect(mockJson).toBeCalledTimes(0);
  expect(mockNext).toBeCalledTimes(1);

  verifySpy.mockRestore();
});

test('Se ocorrer um erro, retorna a mensagem desse erro', async () => {
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

  const mockErrorMessage = 'Erro no servidor';

  const verifySpy = jest
    .spyOn(jwt, 'verify')
    .mockImplementationOnce(() => {
      throw Error(mockErrorMessage);
    });

  await authMiddleware(mockReq, mockRes, mockNext);

  expect(verifySpy).toBeCalledTimes(1);
  expect(mockRes.status).toBeCalledWith(500);
  expect(mockJson).toBeCalledWith({ message: mockErrorMessage });
  expect(mockNext).toBeCalledTimes(0);

  verifySpy.mockRestore();
});
