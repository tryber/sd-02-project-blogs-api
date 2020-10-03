const JWT = require('jsonwebtoken');
const services = require('../services');
const { Users } = require('../models');

describe('Test Post User Route', () => {
  afterEach(() => jest.clearAllMocks());

  const mockReq = {
    body: {
      displayName: 'Marcos Mion',
      email: 'marcos@mion.com',
      password: '123456',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
    },
  };

  const mockRes = (mockParam) => ({
    status: jest
      .fn()
      .mockReturnValue({
        json: mockParam,
      }),
  });

  test('Failed create request', async () => {
    const mockJSON = jest.fn();

    jest
      .spyOn(Users, 'findOne')
      .mockReturnValueOnce(mockReq.body);

    const responseValue = mockRes(mockJSON);

    await services.userLogin(mockReq, responseValue);

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

    await services.userLogin(mockReq, responseValue);

    expect(mockJSON).toBeCalledWith({ token: 'Reginam' });
    expect(mockJSON).toBeCalledTimes(1);
    expect(responseValue.status).toBeCalledWith(201);
    expect(responseValue.status).toBeCalledTimes(1);
  });
});
