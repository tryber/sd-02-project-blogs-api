const userController = require('./user');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');

describe('test user Controller', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = {
        displayName: 'douglas henrique',
        email: 'dougaa@email.com',
        password: 123456,
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      };

      const getUser = jest
        .spyOn(Users, 'findOne')
        .mockReturnValueOnce(null);

      const createUser = jest
        .spyOn(Users, 'create')
        .mockReturnValueOnce(null);

      const createToken = jest
        .spyOn(jwt, 'sign')
        .mockReturnValueOnce('trybetoken');

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.postUser(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(createUser).toBeCalledTimes(1);
      expect(createToken).toBeCalledTimes(1);

      expect(mockJson).toBeCalledWith({ token: 'trybetoken' });
      expect(mockRes.status).toBeCalledWith(201);

      getUser.mockRestore();
      createUser.mockRestore();
      createToken.mockRestore();
    });
  });
  describe('fail cases', () => {
    it('test invalid displayName', async () => {
      const mockData = {
        displayName: 'douglas',
        email: 'dougaa@email.com',
        password: 123456,
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      };

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.postUser(mockReq, mockRes, next);

      expect(next).toBeCalledWith({ code: 'invalid_data', message: 'Name length must be at least 8 characters long' });
    });
    it('test invalid email', async () => {
      const mockData = {
        displayName: 'douglas henrique',
        email: 'emailerrado@email.coma',
        password: 123456,
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      };

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.postUser(mockReq, mockRes, next);

      expect(next).toBeCalledWith({ code: 'invalid_data', message: 'Email must be in a format <name>@<domain>' });
    });
    it('test invalid password', async () => {
      const mockData = {
        displayName: 'douglas henrique',
        email: 'dougaa@email.com',
        password: 12345,
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      };

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.postUser(mockReq, mockRes, next);

      expect(next).toBeCalledWith({ code: 'invalid_data', message: "\"password\" with value \"12345\" fails to match the required pattern: /^[a-zA-Z0-9]{6,}$/" });
    });
    it('test usuario already return', async () => {
      const mockData = {
        displayName: 'douglas henrique',
        email: 'dougaa@email.com',
        password: 123456,
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      };

      const getUser = jest
        .spyOn(Users, 'findOne')
        .mockReturnValueOnce(mockData);

      const createUser = jest
        .spyOn(Users, 'create')
        .mockReturnValueOnce(null);

      const createToken = jest
        .spyOn(jwt, 'sign')
        .mockReturnValueOnce('trybetoken');

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.postUser(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(createUser).toBeCalledTimes(0);
      expect(createToken).toBeCalledTimes(0);

      expect(next).toBeCalledWith({ code: 'conflict', message: 'Usuário já existe' })

      getUser.mockRestore();
      createUser.mockRestore();
      createToken.mockRestore();
    });
  });
});

