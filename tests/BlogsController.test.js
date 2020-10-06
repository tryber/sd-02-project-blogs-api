const JWT = require('jsonwebtoken');
const services = require('../services');
const { BlogPosts, Users } = require('../models');

const mockRes = (mockParam) => ({
  status: jest
    .fn()
    .mockReturnValue({
      json: mockParam,
    }),
});

afterEach(() => jest.clearAllMocks());

describe('Create post route', () => {
  test('post created', async () => {
    const userData = {
      id: 1,
      email: 'marcos@mion.com',
    };

    const bodyReq = {
      headers: {
        authorization: 'data@data.com',
      },
      body: {
        title: 'Some incredible Title',
        content: 'i am happy. And u?',
      },
    };

    const dateMock = new Date('2020-10-06T02:33:52.894Z');
    const globalDateMock = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => dateMock);

    jest
      .spyOn(JWT, 'verify')
      .mockReturnValueOnce({ email: 'data@data.com' });

    jest
      .spyOn(Users, 'findOne')
      .mockReturnValueOnce(userData);

    jest
      .spyOn(BlogPosts, 'create')
      .mockReturnValueOnce(userData);

    const mockJSON = jest.fn();

    const resMock = mockRes(mockJSON);

    await services.createBlogPosts(bodyReq, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Created',
      post: {
        content: 'i am happy. And u?',
        published: dateMock,
        title: 'Some incredible Title',
        updated: dateMock,
        userId: 1,
      },
    });
    expect(resMock.status).toBeCalledWith(201);
    expect(resMock.status).toBeCalledTimes(1);

    globalDateMock.mockRestore();
  });
});

describe('All posts route', () => {
  test('get All posts', async () => {
    jest.spyOn(BlogPosts, 'findAll')
      .mockReturnValueOnce([]);

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.getAllPosts({}, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({ status: 'Success', posts: [] });
    expect(resMock.status).toBeCalledWith(200);
    expect(resMock.status).toBeCalledTimes(1);
  });
});
