const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticatorController = require('./authenticatorController');

const mockUser = [{
  id: 1,
  password: '123456',
  displayName: 'Brett Wiltshire',
  email: 'brett@email.com',
  image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
}];

const createSpy = (func, method, value) => jest
  .spyOn(func, method)
  .mockReturnValueOnce(value);

const mockRightReq = {
  body: {
    email: 'brett@email.com',
    password: '123456',
  },
};

const mockAuthreq = { headers: { authorization: 'authToken' } };

describe('authController tests', () => {
  describe('Test Login', () => {
    test('Successfully login', async () => {
      const mockToken = 'token_gerado';

      const findingUserSpy = createSpy(User, 'findAll', mockUser);
      const returnTokenSpy = createSpy(jwt, 'sign', mockToken);

      // const mockRes = { status: jest.fn().mockReturnValueOnce({ json: jest.fn() }) };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await authenticatorController.login(mockRightReq, mockRes, mockNext);

      expect(findingUserSpy).toBeCalledTimes(1);
      expect(returnTokenSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({ token: 'token_gerado' });

      findingUserSpy.mockRestore();
      returnTokenSpy.mockRestore();
    });

    test('User does not exists', async () => {
      const findingUserSpy = createSpy(User, 'findAll', []);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();

      await authenticatorController.login(mockRightReq, mockRes, mockNext);

      expect(findingUserSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'unauthorized', message: 'Campos inválidos' });

      findingUserSpy.mockRestore();
    });

    test('Not sending email', async () => {
      const mockReqNoEmail = { body: { password: '123456' } };

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();

      await authenticatorController.login(mockReqNoEmail, mockRes, mockNext);

      expect(mockNext).toBeCalledWith({ code: 'unauthorized', message: 'Campos inválidos' });
    });

    test('Not sending password', async () => {
      const mockReqNoPass = { body: { email: 'brett@email.com' } };

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await authenticatorController.login(mockReqNoPass, mockRes, mockNext);

      expect(mockNext).toBeCalledWith({ code: 'unauthorized', message: 'Campos inválidos' });
    });

    test('Wrong passord', async () => {
      const findingUserSpy = createSpy(User, 'findAll', mockUser);

      const mockReq = {
        body: {
          email: 'brett@email.com',
          password: '1234567',
        },
      };

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await authenticatorController.login(mockReq, mockRes, mockNext);

      expect(findingUserSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'unauthorized', message: 'Campos inválidos' });

      findingUserSpy.mockRestore();
    });

    test('Try and catch error', async () => {
      const findingUserSpy = createSpy(User, 'findAll', undefined);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();

      await authenticatorController.login(mockRightReq, mockRes, mockNext);

      expect(findingUserSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });

      findingUserSpy.mockRestore();
    });
  });
  describe('Test Auth', () => {
    test('Request without token', async () => {
      const mockreq = { headers: { authorization: undefined } };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();

      await authenticatorController.authUser(mockreq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith({ code: 'missing_JWT', message: 'Missing JWT' });
    });

    test('No user found', async () => {
      const ReturUserFromTokenSpy = createSpy(jwt, 'verify', { dataValues: { email: 'fake' } });
      const findingUserSpy = createSpy(User, 'findAll', []);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();

      await authenticatorController.authUser(mockAuthreq, mockRes, mockNext);

      expect(ReturUserFromTokenSpy).toBeCalledTimes(1);
      expect(findingUserSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'not_found', message: 'User not found' });

      ReturUserFromTokenSpy.mockRestore();
      findingUserSpy.mockRestore();
    });

    test('Try and catch error', async () => {
      const ReturUserFromTokenSpy = createSpy(jwt, 'verify', undefined);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();

      await authenticatorController.authUser(mockAuthreq, mockRes, mockNext);

      expect(ReturUserFromTokenSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'unauthorized', message: 'Invalid Token' });

      ReturUserFromTokenSpy.mockRestore();
    });

    test('Succesfull auth', async () => {
      const ReturUserFromTokenSpy = createSpy(jwt, 'verify', { dataValues: { email: 'Right Email' } });
      const findingUserSpy = createSpy(User, 'findAll', mockUser);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();

      await authenticatorController.authUser(mockAuthreq, mockRes, mockNext);

      expect(ReturUserFromTokenSpy).toBeCalledTimes(1);
      expect(findingUserSpy).toBeCalledTimes(1);
      expect(mockAuthreq.user).toBe(mockUser);
      expect(mockNext).toBeCalled();

      ReturUserFromTokenSpy.mockRestore();
      findingUserSpy.mockRestore();
    });
  });
});
