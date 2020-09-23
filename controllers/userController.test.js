const userService = require('../services/userService');
const userController = require('./userController');
// const errorController = require('./errorController');
const { Users } = require('../models');

describe('user controller, service tests', () => {
  describe('testando endpoing post /user', () => {
    it('if user was created and returning success with status code 200 and token', async () => {
      const mockBody = {
        displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockReq = { body: mockBody };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockData = {
        id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const user = {
        dataValues: mockData,
      };
      const created = true;
      jest.spyOn(Users, 'findOrCreate').mockReturnValueOnce([user, created]);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(Users.findOrCreate).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockJson.mock.calls[0][0].token).not.toBeNull();
    });
    it('if credentials was wrong and returning error with status code 401', async () => {
      const mockBody = { email: 'jctaraujo', password: '123456' };
      const mockReq = { body: mockBody };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Campos inválidos', code: 'bad_request' };

      jest.restoreAllMocks();

      jest.spyOn(userService, 'findOneAndCreated');
      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(userService.findOneAndCreated).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if user alredy exists returning error with status code 409', async () => {
      const mockBody = {
        displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockReq = { body: mockBody };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Usuário já existe', code: 'already_exists' };
      const user = {
        dataValues: [],
      };
      const created = false;

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOrCreate').mockReturnValueOnce([user, created]);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(Users.findOrCreate).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if database return an error with status code 500', async () => {
      const mockBody = {
        displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockReq = { body: mockBody };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOrCreate').mockImplementationOnce(() => { throw new Error(mockError); });
      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
  describe('testando endpoing get /user', () => {
    it('if returning success with status code 200 and all users', async () => {
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockData = {
        id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const user = {
        dataValues: mockData,
      };

      jest.spyOn(Users, 'findAll').mockReturnValueOnce(user);

      await userController.getAllUsers(null, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(Users.findAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockJson.mock.calls[0][0].token).not.toBeNull();
    });
    it.only('if credentials was wrong and returning error with status code 401', async () => {
      const mockBody = { email: 'jctaraujo', password: '123456' };
      const mockReq = { body: mockBody };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Campos inválidos', code: 'bad_request' };

      jest.restoreAllMocks();

      jest.spyOn(userService, 'findAll');
      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(userService.findOneAndCreated).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if user alredy exists returning error with status code 409', async () => {
      const mockBody = {
        displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockReq = { body: mockBody };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Usuário já existe', code: 'already_exists' };
      const user = {
        dataValues: [],
      };
      const created = false;

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOrCreate').mockReturnValueOnce([user, created]);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(Users.findOrCreate).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if database return an error with status code 500', async () => {
      const mockBody = {
        displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockReq = { body: mockBody };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOrCreate').mockImplementationOnce(() => { throw new Error(mockError); });
      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
