const JWT = require('jsonwebtoken');
const services = require('../services');
const { Users } = require('../models');

const mockRes = (mockParam) => ({
  status: jest
    .fn()
    .mockReturnValue({
      json: mockParam,
    }),
});

afterEach(() => jest.clearAllMocks());

describe('Test Post User Route', () => {
  const mockReq = {
    body: {
      displayName: 'Marcos Mion',
      email: 'marcos@mion.com',
      password: '123456',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
    },
  };

  test('Failed create request', async () => {
    const mockJSON = jest.fn();

    jest
      .spyOn(Users, 'findOne')
      .mockReturnValueOnce(mockReq.body);

    const responseValue = mockRes(mockJSON);

    await services.createUser(mockReq, responseValue);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({ message: 'Usuário já existe' });
    expect(responseValue.status).toBeCalledWith(409);
    expect(responseValue.status).toBeCalledTimes(1);
  });

  test('Succesfully insert user', async () => {
    const mockJSON = jest.fn();

    jest
      .spyOn(Users, 'findOne')
      .mockReturnValueOnce(null);

    jest
      .spyOn(JWT, 'sign')
      .mockReturnValueOnce('Reginam');

    jest
      .spyOn(Users, 'create')
      .mockReturnValueOnce();

    const responseValue = mockRes(mockJSON);

    await services.createUser(mockReq, responseValue);

    expect(mockJSON).toBeCalledWith({ token: 'Reginam' });
    expect(mockJSON).toBeCalledTimes(1);
    expect(responseValue.status).toBeCalledWith(201);
    expect(responseValue.status).toBeCalledTimes(1);
  });
});

describe('All users route', () => {
  test('get All users without token', async () => {
    const users = [
      {
        displayName: 'Marcos Mion',
        email: 'marcos@mion.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
      {
        displayName: 'Daniel Luiz Chaleguy',
        email: 'daniel.luiz@chalezinho.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    ];

    const mockResponse = jest.fn();

    jest
      .spyOn(Users, 'findAll')
      .mockReturnValueOnce(users);

    const resValue = mockRes(mockResponse);

    await services.getAllUsers({}, resValue);

    expect(mockResponse).toBeCalledTimes(1);
    expect(mockResponse).toBeCalledWith({ status: 'Success', users });
    expect(resValue.status).toBeCalledWith(200);
    expect(resValue.status).toBeCalledTimes(1);
  });
});

describe('Get users by id value', () => {
  test('user not exists', async () => {
    jest
      .spyOn(Users, 'findByPk')
      .mockReturnValueOnce(null);

    const mockReq = {
      params: {
        id: null,
      },
    };

    const userByIdMock = jest.fn();
    const noUserRes = mockRes(userByIdMock);

    await services.getUser(mockReq, noUserRes);

    expect(userByIdMock).toBeCalledTimes(1);
    expect(userByIdMock).toBeCalledWith({ message: 'User not exists', code: 'not_found' });
    expect(noUserRes.status).toBeCalledWith(404);
    expect(noUserRes.status).toBeCalledTimes(1);
  });

  test('success request', async () => {
    const userObj = {
      id: 1,
      displayName: 'Marcos Mion',
      email: 'marcos@mion.com',
      password: '123456',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
    };

    jest
      .spyOn(Users, 'findByPk')
      .mockReturnValueOnce(userObj);

    const mockReq = {
      params: {
        id: 1,
      },
    };

    const userByIdMock = jest.fn();
    const noUserRes = mockRes(userByIdMock);

    await services.getUser(mockReq, noUserRes);

    expect(userByIdMock).toBeCalledTimes(1);
    expect(userByIdMock).toBeCalledWith({ status: 'Success', user: userObj });
    expect(noUserRes.status).toBeCalledWith(200);
    expect(noUserRes.status).toBeCalledTimes(1);
  });
});
