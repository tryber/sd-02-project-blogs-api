const userController = require('./userController');
const { User } = require('../models');

describe('userController tests', () => {
  describe('Login User', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = { email: 'johnatas@email.cxom', password: '131072' };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoi = { code: 'bad_request', error: true, message: '"email" must be a valid email' };
      const loginUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce();

      await userController.loginUser(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoi);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      loginUserSpy.mockRestore();
    });

    test('If pass invalid credentials, return a service message and status 400', async () => {
      const mockBodyData = { email: 'johnatas@email.com', password: '131072' };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { code: 'bad_request', error: true, message: 'Campos inválidos' };
      const userData = {
        id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', image: null,
      };
      const mockSequelize = { dataValues: userData, ...userData };
      const loginUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

      await userController.loginUser(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      loginUserSpy.mockRestore();
    });

    test('If pass valid credentials, return a token and status 200', async () => {
      const mockBodyData = { email: 'johnatas.henrique@gmail.com', password: '524288' };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const userData = {
        id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', image: null,
      };
      const mockSequelize = { dataValues: userData, ...userData };
      const loginUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

      await userController.loginUser(mockReq, mockRes, mockNext);

      expect(loginUserSpy).toBeCalledTimes(1);
      expect(mockNext).not.toBeCalled();
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson.mock.calls[0][0]).toHaveProperty('token');

      loginUserSpy.mockRestore();
    });
  });

  describe('Create User', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = {
        displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.cxom', password: '524288',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoiAnswer = {
        code: 'bad_request', error: true, message: '"email" must be a valid email',
      };
      const userData = {
        id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', image: null,
      };
      const mockSequelize = { dataValues: userData, ...userData };
      const createUserSpy = jest.spyOn(User, 'create').mockReturnValueOnce(mockSequelize);
      const loginUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      createUserSpy.mockRestore();
      loginUserSpy.mockRestore();
    });

    test('If pass an user who is in the database, return message and status 409', async () => {
      const mockBodyData = {
        displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { error: true, message: 'Usuário já existe', code: 'already_exists' };
      const userData = {
        id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', image: null,
      };
      const mockSequelize = { dataValues: userData, ...userData };
      const createUserSpy = jest.spyOn(User, 'create').mockReturnValueOnce(mockSequelize);
      const loginUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      createUserSpy.mockRestore();
      loginUserSpy.mockRestore();
    });

    test('If pass valid credentials, return a response and status 200', async () => {
      const mockBodyData = {
        displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const userData = {
        id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', image: null,
      };
      const mockSequelize = { dataValues: userData, ...userData };
      let findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
      const createUserSpy = jest.spyOn(User, 'create').mockReturnValueOnce();
      findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(findUserSpy).toBeCalledTimes(2);
      expect(createUserSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson.mock.calls[0][0]).toHaveProperty('token');

      findUserSpy.mockRestore();
      createUserSpy.mockRestore();
    });
  });

  describe('Get All Users', () => {
    test('Return all users from database and status 200', async () => {
      const mockResponse = [
        {
          id: 1,
          displayName: 'Brett Wiltshire',
          email: 'brett@email.com',
          image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
        },
        {
          id: 2,
          displayName: 'Johnatas Henrique',
          email: 'johnatas.henrique@gmail.com',
          password: '524288',
          image: null,
        },
      ];
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const getAllUsersSpy = jest.spyOn(User, 'findAll').mockReturnValueOnce(mockResponse);

      await userController.getAllUsers(null, mockRes);

      expect(getAllUsersSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockResponse);

      getAllUsersSpy.mockRestore();
    });
  });

  describe('Get User By Id', () => {
    test('If service does not find any info, return a message', async () => {
      const mockReq = { params: { id: 100 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const serviceAnswer = { code: 'not_found', error: true, message: 'Usuário não existe' };
      const getUserByIdSpy = jest.spyOn(User, 'findByPk').mockReturnValueOnce(null);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      getUserByIdSpy.mockRestore();
    });

    test('If req.params.id is a valid user, return user info and status 200', async () => {
      const mockReq = { params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const userData = {
        id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
      };
      const mockSequelize = { dataValues: userData };
      const getUserByIdSpy = jest.spyOn(User, 'findByPk').mockReturnValueOnce(mockSequelize);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(getUserByIdSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockSequelize);
      expect(mockNext).not.toHaveBeenCalled();

      getUserByIdSpy.mockRestore();
    });
  });

  describe('Delete User By Id', () => {
    test('When deleting, return an end and status 204', async () => {
      const mockReq = { user: { id: 1 } };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const deleteUserByIdSpy = jest.spyOn(User, 'destroy').mockReturnValueOnce();

      await userController.deleteUserById(mockReq, mockRes, mockNext);

      expect(deleteUserByIdSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(204);
      expect(mockEnd).toBeCalled();

      deleteUserByIdSpy.mockRestore();
    });
  });
});
