const { User } = require('../models');
const usersController = require('./users');

// agradeço a guicgs por me ajudar nos testes de erro 500.

afterEach(() => {
  jest.restoreAllMocks();
});

describe.skip('createUser', () => {
  test('integrity test - password length', async () => {
    const mockReq = {
      body: {
        displayName: 'user 1',
        email: 'jestUser@gmail.com',
        password: '1234567',
        image: 'xablau.png',
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockData = {
      code: 400, message: 'Bad request',
    };

    await usersController.createUser(mockReq, mockRes);
    expect(mockReq.body).toHaveProperty('password');
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith(mockData);
  });
  test('integrity test - mail regex', async () => {
    const mockReq = {
      body: {
        displayName: 'jest user',
        email: 'jestUsergmail.coxxm',
        password: '123456',
        image: 'xablau.png',
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockData = {
      code: 400, message: 'Bad request',
    };

    await usersController.createUser(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith(mockData);
  });
  test('data ok. Check User', async () => {
    const mockReq = {
      body: {
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
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

    const mockData = {
      code: 409, message: 'User already exists',
    };

    await usersController.createUser(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(409);
    expect(mockJson).toBeCalledWith(mockData);
  });
  test('data ok. User Checked. Create!', async () => {
    const mockBodyData = {
      displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '123456', image: null,
    };
    const mockReq = { body: mockBodyData };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const userData = {
      id: 13, displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '123456', image: null,
    };
    const mockSequelize = { dataValues: userData, ...userData };
    let findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(null);
    const createUserSpy = jest.spyOn(User, 'create').mockReturnValueOnce();
    findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

    await usersController.createUser(mockReq, mockRes);

    expect(findUserSpy).toBeCalledTimes(2);
    expect(createUserSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockJson.mock.calls[0][0]).toHaveProperty('token');

    findUserSpy.mockRestore();
    createUserSpy.mockRestore();
  });
  test('Error 500', async () => {
    const mockBody = {
      displayName: 'Lulao', email: 'lulalivre@hotmail.com', password: '123456', image: 'img.png',
    };
    const mockReq = { body: mockBody };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockError = { message: 'erro na conexão com base de dados' };

    jest.restoreAllMocks();

    jest.spyOn(User, 'findOne').mockImplementationOnce(() => { throw new Error(mockError); });
    await usersController.createUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.status).toBeCalledWith(500);
  });
});

describe.skip('loginUser', () => {
  test('check credentials', async () => {
    jest.spyOn(console, 'error').mockReturnValueOnce();
    const result = {
      id: 1,
      displayName: 'Zé qualquer',
      password: '123456',
      email: 'ze@zezo.com',
      image: 'img.png',
    };

    const mockWrongMail = {
      body: {
        email: 'falazeze@zezo.com',
        password: '123456',
      },
    };

    const mockIncorrectPassword = {
      body: {
        email: 'ze@zezo.com',
        password: 'asdfgh',
      },
    };

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    let mockFindAll = jest
      .spyOn(User, 'findAll')
      .mockResolvedValue([]);

    await usersController.loginUser(mockWrongMail, mockRes);
    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('Bad request');

    mockFindAll.mockClear();

    mockFindAll = jest
      .spyOn(User, 'findAll')
      .mockResolvedValue([result]);

    await usersController.loginUser(mockIncorrectPassword, mockRes);
    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('Bad request');
  });
  test('credentials OK. Logging in', async () => {
    const mockBodyData = {
      displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '123456', image: null,
    };
    const mockReq = { body: mockBodyData };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const userData = {
      id: 13, displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '123456', image: null,
    };
    const mockSequelize = { dataValues: userData, ...userData };
    const findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

    await usersController.loginUser(mockReq, mockRes);

    expect(findUserSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockJson.mock.calls[0][0]).toHaveProperty('token');

    findUserSpy.mockRestore();
  });
  test('wrong password', async () => {
    const mockBodyData = {
      displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '123456', image: null,
    };
    const mockReq = { body: mockBodyData };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };
    const userData = {
      id: 13, displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '122456', image: null,
    };
    let mockSequelize = { dataValues: userData, ...userData };
    let findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

    await usersController.loginUser(mockReq, mockRes);

    let mockData = {
      code: 400, message: 'Bad request',
    };

    expect(findUserSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith(mockData);

    findUserSpy.mockClear();
    mockSequelize = null;

    findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

    mockData = {
      code: 404, message: 'User not found',
    };
    await usersController.loginUser(mockReq, mockRes);
    expect(findUserSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJson).toBeCalledWith(mockData);
  });
  test('Error 500', async () => {
    const mockBody = {
      displayName: 'Lulao', email: 'lulalivre@hotmail.com', password: '123456', image: 'img.png',
    };
    const mockReq = { body: mockBody };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockError = { message: 'erro na conexão com base de dados' };

    jest.restoreAllMocks();

    jest.spyOn(User, 'findOne').mockImplementationOnce(() => { throw new Error(mockError); });
    await usersController.loginUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalled();
    expect(mockRes.status).toBeCalledWith(500);
  });
});

describe.skip('list', () => {
  test('listing all users', async () => {
    const mockFindAll = jest
      .spyOn(User, 'findAll')
      .mockResolvedValue([
        {
          id: 1,
          displayName: 'user 1',
          email: 'user1@mail.com',
          image: 'img.png',
        },
        {
          id: 2,
          displayName: 'user 2',
          email: 'user2@mail.com',
          image: 'img.png',
        },
      ]);

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await usersController.list(null, mockRes);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJSON.mock.calls[0][0].users).toBeInstanceOf(Array);
    mockJSON.mock.calls[0][0].users.forEach((user) => expect(user).not.toHaveProperty('password'));
  });
  test('Error 500', async () => {
    jest.spyOn(console, 'error').mockReturnValueOnce();

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    const mockFindAll = jest
      .spyOn(User, 'findAll')
      .mockRejectedValue(new Error());

    await usersController.list(null, mockRes);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});

describe.skip('listOne', () => {
  test('user not found', async () => {
    const mockFindUser = jest
      .spyOn(User, 'findOne')
      .mockResolvedValue();

    const mockReq = {
      params: {
        id: 10,
      },
    };

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await usersController.listOne(mockReq, mockRes);
    expect(mockFindUser).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('User not found');
  });
  test('listing single user', async () => {
    const mockFindOne = jest
      .spyOn(User, 'findAll')
      .mockResolvedValue([
        {
          id: 1,
          displayName: 'user 1',
          email: 'user1@mail.com',
          image: 'img.png',
        },
      ]);

    const mockJSON = jest.fn();

    const mockReq = {
      params: {
        id: 1,
      },
    };

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await usersController.listOne(mockReq, mockRes);

    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJSON.mock.calls[0][0]).toBeInstanceOf(Array);
    expect(mockJSON.mock.calls[0][0]).not.toHaveProperty('password');
  });
  test('Error 500', async () => {
    jest.spyOn(console, 'error').mockReturnValueOnce();

    const mockReq = {
      params: {
        id: 1,
      },
    };

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    const mockFindAll = jest
      .spyOn(User, 'findAll')
      .mockRejectedValue(new Error());

    await usersController.listOne(mockReq, mockRes);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});

describe.skip('deleteUser', () => {
  test('delete one user', async () => {
    const mockReq = {
      user: {
        id: 1,
      },
    };

    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    const mockDestroy = jest
      .spyOn(User, 'destroy')
      .mockResolvedValue(true);

    await usersController.deleteUser(mockReq, mockRes);

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
  });
  test('Error 500', async () => {
    jest.spyOn(console, 'error').mockReturnValueOnce();

    const mockReq = {
      user: {
        id: 1,
      },
    };

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    const mockDestroy = jest
      .spyOn(User, 'destroy')
      .mockRejectedValue(new Error());

    await usersController.deleteUser(mockReq, mockRes);

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});
