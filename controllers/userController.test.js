const jwt = require('jsonwebtoken');
const { User } = require('../models');
const userController = require('./userController');

describe('register', () => {
  test('Se o campo password não tiver 6 caracteres, retorna mensagem de erro', async () => {
    const mockReq = {
      body: {
        displayName: 'Thiago Silva',
        email: 'thiagosilva@gmail.com',
        password: '1234567',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockData = {
      message: 'O campo password deve conter 6 caracteres.',
    };

    await userController.register(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(422);
    expect(mockJson).toBeCalledWith(mockData);
  });

  test('Se o email já existir, retorna mensagem de erro', async () => {
    const mockReq = {
      body: {
        displayName: 'Thiago Silva',
        email: 'thiagosilva@gmail.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const findOrCreateSpy = jest
      .spyOn(User, 'findOrCreate')
      .mockReturnValueOnce([
        { id: 21, ...mockReq.body },
        false,
      ]);

    const mockData = {
      message: 'Usuário já existe',
    };

    await userController.register(mockReq, mockRes);

    expect(findOrCreateSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(409);
    expect(mockJson).toBeCalledWith(mockData);

    findOrCreateSpy.mockRestore();
  });

  test('Se o email é único, retorna um token', async () => {
    const mockReq = {
      body: {
        displayName: 'Thiago Silva',
        email: 'thiagosilva@gmail.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const findOrCreateSpy = jest
      .spyOn(User, 'findOrCreate')
      .mockReturnValueOnce([
        { id: 16, ...mockReq.body },
        true,
      ]);

    const findOneSpy = jest
      .spyOn(User, 'findOne')
      .mockReturnValueOnce({
        dataValues: { id: 16, ...mockReq.body },
      });

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImRpc3BsYXlOYW1lIjoiVGhpYWdvIFNpbHZhIiwiZW1haWwiOiJ0aGlhZ29zaWx2YUBnbWFpbC5jb20iLCJpbWFnZSI6Imh0dHA6Ly80LmJwLmJsb2dzcG90LmNvbS9fWUE1MGFkUS03dlEvUzFnZlJfNnVmcEkvQUFBQUFBQUFBQWsvMUVySkdnUldaRGcvUzQ1L2JyZXR0LnBuZyIsImlhdCI6MTU5OTQ3Mjg3NSwiZXhwIjoxNTk5NDc1ODc1fQ.-OCJAeGARIaApQlQwYFOa8v59wGo3vYQ6jTjukKfmus';

    const signSpy = jest
      .spyOn(jwt, 'sign')
      .mockReturnValueOnce(mockToken);

    const mockData = {
      token: mockToken,
    };

    await userController.register(mockReq, mockRes);

    expect(findOrCreateSpy).toBeCalledTimes(1);
    expect(findOneSpy).toBeCalledTimes(1);
    expect(signSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockJson).toBeCalledWith(mockData);

    findOrCreateSpy.mockRestore();
    findOneSpy.mockRestore();
    signSpy.mockRestore();
  });
});

describe('getAll', () => {
  test('Retorna todos os usuários sem o campo password', async () => {
    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockData = [
      {
        id: 1,
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    ];

    const mockUsers = [
      {
        id: 1,
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    ];

    const findAllSpy = jest
      .spyOn(User, 'findAll')
      .mockReturnValueOnce(mockData);

    await userController.getAll(null, mockRes);

    expect(findAllSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith(mockUsers);

    findAllSpy.mockRestore();
  });
});

describe('getById', () => {
  test('Se usuário não existe, retorna erro com status 404', async () => {
    const mockReq = {
      params: { id: 4500 },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const findByPkSpy = jest
      .spyOn(User, 'findByPk')
      .mockReturnValueOnce(null);

    await userController.getById(mockReq, mockRes);

    expect(findByPkSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJson).toBeCalledWith({ message: 'Usuário não encontrado' });

    findByPkSpy.mockRestore();
  });

  test('Se usuário não existe, retorna erro com status 404', async () => {
    const mockReq = {
      params: { id: 1 },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockUser = {
      id: 1,
      displayName: 'Brett Wiltshire',
      email: 'brett@email.com',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
    };

    const findByPkSpy = jest
      .spyOn(User, 'findByPk')
      .mockReturnValueOnce(mockUser);

    await userController.getById(mockReq, mockRes);

    expect(findByPkSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith(mockUser);

    findByPkSpy.mockRestore();
  });
});
