const { User } = require('../models');
const usersController = require('./users');

describe.skip('createUser', () => {
  test('integrity test - password length', async () => {
    const mockReq = {
      body: {
        displayName: 'jest user',
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

describe('loginUser', () => {
  test('check credentials', async () => {
    const mockBody = { email: 'userqualquer@gmail.com', password: '123456' };
    const mockReq = { body: mockBody };
    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockData = {
      code: 404, message: 'User not found',
    };

    await usersController.loginUser(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJson).toBeCalledWith(mockData);
  });
  test('credentials OK', async () => {
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
  test('wrong Password', async () => {
    const mockBodyData = {
      displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '123456', image: null,
    };
    const mockReq = { body: mockBodyData };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const userData = {
      id: 13, displayName: 'Lula da Silva', email: 'lula2020@gmail.com', password: '122456', image: null,
    };
    const mockSequelize = { dataValues: userData, ...userData };
    const findUserSpy = jest.spyOn(User, 'findOne').mockReturnValueOnce(mockSequelize);

    await usersController.loginUser(mockReq, mockRes);

    const mockData = {
      code: 400, message: 'Bad request',
    };

    expect(findUserSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith(mockData);

    findUserSpy.mockRestore();
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

// describe('users route', () => {
//   test('usersController.CreateUser controller', async () => {
//     const reqMock = {
//       body: {
//         displayName: 'k6',
//         email: 'k6@mailist.com',
//         password: 'tulin',
//         image: 'xablau.jpg',
//       },
//     };
//     const resMock = {
//       status: jest.fn().mockReturnValueOnce({
//         token: 'xablau', // mock da geração do token?
//       }),
//     };
//     await usersController.createUser(reqMock, resMock, jest.fn());
//   });
// });
