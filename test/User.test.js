const controller = require('../controller');
const { User } = require('../models');

const mockUser = {
  id: 1,
  displayName: 'Andrey Kenji',
  email: 'andreytsuzuki@gmail.com',
  password: '$2b$10$AFbJ4Du5TTISYtnMmf.ib.t766IgP2VfI9286gRW06gJqjdwBLp2S',
  image: 'hhth4',
};

jest.mock('jsonwebtoken');

describe('User Model', () => {
  test('When getting a User with id 1, should return an single User', async () => {
    const findByIdSpy = jest
      .spyOn(User, 'findByPk')
      .mockReturnValueOnce(mockUser);

    const mockJson = jest.fn();
    const mockReq = { params: { id: 1 } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.user.findById(mockReq, mockRes);

    // Assert
    expect(findByIdSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith(mockUser);

    findByIdSpy.mockRestore();
  });

  test('When register a user', async () => {
    const mockData = {
      displayName: 'Rosnaldinho Patricio',
      email: 'rosnaldo@gmail.com',
      image: 'hhth4',
    };

    const findOneSpy = jest
      .spyOn(User, 'findOne')
      .mockReturnValueOnce();

    const createSpy = jest
      .spyOn(User, 'create')
      .mockReturnValueOnce({ dataValues: { ...mockUser } });
      
    const mockJson = jest.fn();
    const mockReq = { body: { ...mockData, password: "123456" } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.user.register(mockReq, mockRes);

    // Assert
    expect(findOneSpy).toBeCalledTimes(1);
    expect(createSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockJson.mock.calls[0][0]).toHaveProperty('token');

    findOneSpy.mockRestore();
    createSpy.mockRestore();
  });

  test('When login a user', async () => {
    const mockBody = {
      email: 'andreytsuzuki@gmail.com',
      password: '123456',
    };

    const findOneSpy = jest
      .spyOn(User, 'findOne')
      .mockReturnValueOnce({ dataValues: { ...mockUser } });

    const mockJson = jest.fn();
    const mockReq = { body: { ...mockBody } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.user.login(mockReq, mockRes);

    // Assert
    expect(findOneSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson.mock.calls[0][0]).toHaveProperty('token');

    findOneSpy.mockRestore();
  });

  test('Find all users', async () => {
    const mockUsers = [
      {
        id: 1,
        displayName: 'Andrey Kenji',
        email: 'andreytsuzuki@gmail.com',
        password: '$2b$10$AFbJ4Du5TTISYtnMmf.ib.t766IgP2VfI9286gRW06gJqjdwBLp2S',
        image: 'hhth4',
      }
    ];

    const findAllSpy = jest
      .spyOn(User, 'findAll')
      .mockReturnValueOnce(mockUsers);

    const mockJson = jest.fn();
    const mockReq = {};
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.user.findAll(mockReq, mockRes);

    // Assert
    expect(findAllSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith(mockUsers);

    findAllSpy.mockRestore();
  });

  test('Delete user', async () => {
    const deleteSpy = jest
      .spyOn(User, 'destroy')
      .mockReturnValueOnce();

    const mockJson = jest.fn();
    const mockReq = { user: { dataValues: { id: 1 } } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.user.deleteUser(mockReq, mockRes);

    // Assert
    expect(deleteSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith({ message: 'usuário deletado com sucesso' });

    deleteSpy.mockRestore();
  });
});
