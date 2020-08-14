const jwt = require('jsonwebtoken');
const userController = require('./user');
const { Users } = require('../models');

describe('test user Controller login', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = {
        email: 'dougaa@email.com',
        password: '123456',
      };

      const getUser = jest
        .spyOn(Users, 'findOne')
        .mockReturnValueOnce({ dataValues: mockData });

      const createToken = jest
        .spyOn(jwt, 'sign')
        .mockReturnValueOnce('trybetoken');

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.login(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(createToken).toBeCalledTimes(1);

      expect(mockJson).toBeCalledWith({ token: 'trybetoken' });
      expect(mockRes.status).toBeCalledWith(200);

      getUser.mockRestore();
      createToken.mockRestore();
    });
  });
  describe('fail cases', () => {
    it('test invalid password', async () => {
      const mockData = {
        email: 'dougaa@email.com',
        password: '12345677',
      };
      const mockDataCorrect = {
        email: 'dougaa@email.com',
        password: '1234567',
      };
      const getUser = jest
        .spyOn(Users, 'findOne')
        .mockReturnValueOnce({ dataValues: mockDataCorrect });

      const createToken = jest
        .spyOn(jwt, 'sign')
        .mockReturnValueOnce();

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.login(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(createToken).toBeCalledTimes(0);

      expect(next).toBeCalledWith({ message: 'Campos inválidos', code: 'invalid_data' });

      getUser.mockRestore();
      createToken.mockRestore();
    });
    it('test invalid email', async () => {
      const mockData = {
        email: 'fakeemail@email.com',
        password: 12345,
      };

      const getUser = jest
        .spyOn(Users, 'findOne')
        .mockReturnValueOnce(null);

      const createToken = jest
        .spyOn(jwt, 'sign')
        .mockReturnValueOnce('');

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.login(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(createToken).toBeCalledTimes(0);

      expect(next).toBeCalledWith({ message: 'Campos inválidos', code: 'invalid_data' });

      getUser.mockRestore();
      createToken.mockRestore();
    });
  });
});
