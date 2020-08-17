const UserController = require('./UserController');
const errorController = require('./errorController');
const UserService = require('../services/UserService');

describe('Testing User Controller', () => {
  describe('Testing New User in POST Method.', () => {
    test('Verify if rescue catch\'s invalid body with JoI.', async () => {
      // Arrange
      const errorMock = {
        error: {
          message: '\"displayName\" length must be at least 8 characters long',
          code: 'Invalid_data',
        },
      };

      const mockReq = {
        body: {
          displayName: 'Felipe',
          email: 'lipe@lipe.com',
          password: '123456789',
        },
      };

      const nextMock = jest.fn();
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      // Act
      await errorController(errorMock, null, mockRes);
      await UserController.newUser(mockReq, mockRes, nextMock);
      // Assert
      expect(nextMock).toBeCalledWith(errorMock);
      expect(mockRes.status).toBeCalledWith(422);
    });

    test('Verify if email of newUser already exists', async () => {
      // Arrange
      const errorMock = { error: { message: 'Usuário já existe.', code: 'Already_exists' } };
      const mockReq = {
        body: {
          displayName: 'Felipe Andrade',
          email: 'lipe@lipe.com',
          password: '123456789',
        },
      };
      const nextMock = jest.fn();
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      const UserServiceSpy = jest
        .spyOn(UserService, 'newUser')
        .mockImplementation(() => {
          throw errorMock;
        });
      // Act
      await errorController(errorMock, null, mockRes);
      await UserController.newUser(mockReq, mockRes, nextMock);
      // Assert
      expect(UserServiceSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(409);
      expect(nextMock).toBeCalledWith(errorMock);

      UserServiceSpy.mockRestore();
    });

    test('Creating newUser and return a token', async () => {
      // Arrange
      const tokenMock = 'token-aqui';
      const mockReq = {
        body: {
          displayName: 'Felipe Andrade',
          email: 'lipe@lipe.com',
          password: '123456789',
        },
      };
      const nextMock = jest.fn();
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };
      const UserServiceSpy = jest
        .spyOn(UserService, 'newUser')
        .mockImplementation(() => tokenMock);
      // Act
      await UserController.newUser(mockReq, mockRes, nextMock);
      // Assert
      expect(UserServiceSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson).toBeCalledWith({ token: tokenMock });

      UserServiceSpy.mockRestore();
    });
  });

  describe('Testing getAllUsers in GET Method', () => {
    test('Testing if rescue catch Internal_error of findAll function', async () => {
      // Arrange
      const errorMock = { error: { message: 'e.message', code: 'Internal_error' } };
      const nextMock = jest.fn();
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const UserServiceSpy = jest
        .spyOn(UserService, 'getAllUsers')
        .mockImplementation(() => {
          throw errorMock;
        });
      // Act
      await errorController(errorMock, null, mockRes, nextMock);
      await UserController.getAllUsers(null, mockRes, nextMock);
      // Assert
      expect(UserServiceSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(nextMock).toBeCalledWith(errorMock);

      UserServiceSpy.mockRestore();
    });

    test('Testing if rescue catch dataBase without Users', async () => {
      // Arrange
      const errorMock = { error: { message: 'Dados não encontrados.', code: 'Not_found' } };
      const nextMock = jest.fn();
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const UserServiceSpy = jest
        .spyOn(UserService, 'getAllUsers')
        .mockImplementation(() => {
          throw errorMock;
        });
      // Act
      await errorController(errorMock, null, mockRes, nextMock);
      await UserController.getAllUsers(null, mockRes, nextMock);
      // Assert
      expect(UserServiceSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(404);
      expect(nextMock).toBeCalledWith(errorMock);

      UserServiceSpy.mockRestore();
    });
    test('Returning allUsers', async () => {
      // Arrange
      const dataValuesMock = {
        id: 2,
        displayName: 'Felipe Lima',
        email: 'lipe@lipe.com',
        password: '12356789',
        image: '',
      };

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const UserServiceSpy = jest
        .spyOn(UserService, 'getAllUsers')
        .mockImplementation(() => dataValuesMock);
      // Act
      await UserController.getAllUsers(null, mockRes);
      // Assert
      expect(UserServiceSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(dataValuesMock);

      UserServiceSpy.mockRestore();
    });
  });

  describe('Testing GetUserById in GET METHOD', () => {
    test('User doens\'t exist', async () => {
      // Arrange
      const errorMock = { error: { message: 'Usuário não encontrado', code: 'Not_found' } };
      const mockJson = jest.fn();
      const nextMock = jest.fn();
      const mockReq = { params: '50' };
      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const UserServiceSpy = jest
        .spyOn(UserService, 'getUserById')
        .mockImplementation(() => {
          throw errorMock;
        });
      // Act
      await errorController(errorMock, null, mockRes, nextMock);
      await UserController.getUserById(mockReq, mockRes, nextMock);
      // Assert
      expect(UserServiceSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(404);
      expect(nextMock).toBeCalledWith(errorMock);

      UserServiceSpy.mockRestore();
    });

    test('User return', async () => {
      // Arrange
      const dataValuesMock = {
        id: '2',
        displayName: 'Felipe Lima',
        email: 'lipe@lipe.com',
        image: '',
      };
      const mockReq = { params: '2' };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const UserServiceSpy = jest
        .spyOn(UserService, 'getUserById')
        .mockImplementation(() => dataValuesMock);
      // Act
      await UserController.getUserById(mockReq, mockRes);
      // Assert
      expect(UserServiceSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(dataValuesMock);

      UserServiceSpy.mockRestore();
    });
  });
});
