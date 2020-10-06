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

describe('Edit post', () => {
  const post = {
    id: 1,
    published: new Date('2011-08-01T19:58:00.000Z'),
    updated: new Date('2011-08-01T19:58:51.947Z'),
    title: 'Latest updates, August 1st',
    content: 'The whole text for the blog post goes here in this key',
    userId: 1,
  };

  const updatedPost = {
    id: 1,
    published: new Date('2011-08-01T19:58:00.000Z'),
    updated: new Date('2011-08-01T19:58:51.947Z'),
    title: 'Some awesome Title',
    content: 'Some awesome content',
    userId: 1,
  };

  const userIdOne = {
    id: 1,
    displayName: 'Marcos Mion',
    email: 'marcos@mion.com',
    password: '123456',
    image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
  };

  const userIdTwo = {
    id: 2,
    displayName: 'José Mion',
    email: 'data@data.com',
    password: '123456',
    image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
  };

  test('post not exists', async () => {
    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(null);

    const reqMock = {
      params: {
        id: 1,
      },
    };

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.editPost(reqMock, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Post não encontrado. Mandou o ID certo?',
      code: 'not_found',
    });
    expect(resMock.status).toBeCalledWith(404);
    expect(resMock.status).toBeCalledTimes(1);
  });

  test('post found, but userId is different', async () => {
    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(post);

    jest
      .spyOn(JWT, 'verify')
      .mockReturnValueOnce({ email: 'data@data.com' });

    jest
      .spyOn(Users, 'findOne')
      .mockReturnValueOnce(userIdTwo);

    const mockReq = {
      params: {
        id: 1,
      },
      headers: {
        authorization: 'hamburguer',
      },
    };

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.editPost(mockReq, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Esse post não é seu. Não é bonito mexer nas coisas dos outros.',
      code: 'Forbidden',
    });
    expect(resMock.status).toBeCalledWith(403);
    expect(resMock.status).toBeCalledTimes(1);
  });

  test('post found, userId equal, ready to edit', async () => {
    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(post);

    jest
      .spyOn(JWT, 'verify')
      .mockReturnValueOnce({ email: 'marcos@mion.com' });

    jest
      .spyOn(Users, 'findOne')
      .mockReturnValueOnce(userIdOne);

    jest
      .spyOn(BlogPosts, 'update')
      .mockReturnValueOnce(() => jest.fn());

    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(updatedPost);

    const mockReq = {
      params: {
        id: 1,
      },
      headers: {
        authorization: 'hamburguer',
      },
      body: {
        title: 'Some awesome Title',
        content: 'Some awesome content',
      },
    };

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.editPost(mockReq, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Success',
      post: updatedPost,
    });
    expect(resMock.status).toBeCalledWith(200);
    expect(resMock.status).toBeCalledTimes(1);
  });
});

describe('Only one post route', () => {
  test('post not exists', async () => {
    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(null);

    const reqMock = {
      params: {
        id: 3366,
      },
    };

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.getPost(reqMock, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Post não encontrado. Mandou o ID certo?',
      code: 'not_found',
    });
    expect(resMock.status).toBeCalledWith(404);
    expect(resMock.status).toBeCalledTimes(1);
  });

  test('Post exists', async () => {
    const post = {
      id: 1,
      published: new Date('2011-08-01T19:58:00.000Z'),
      updated: new Date('2011-08-01T19:58:51.947Z'),
      title: 'Latest updates, August 1st',
      content: 'The whole text for the blog post goes here in this key',
      userId: 1,
    };

    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(post);

    const reqMock = {
      params: {
        id: 1,
      },
    };

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.getPost(reqMock, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Success',
      post,
    });
    expect(resMock.status).toBeCalledWith(200);
    expect(resMock.status).toBeCalledTimes(1);
  });
});

describe('Search post by word in title or content', () => {
  const postStructure = {
    id: 2,
    published: '2020-10-05T19:08:47.000Z',
    updated: '2020-10-05T19:08:47.000Z',
    title: 'Latest updates, August 35th',
    content: 'Esse post é um oferecimento das Casas Bahiaaaaaaa',
    User: {
      id: 1,
      displayName: 'Marcos Mion',
      email: 'marcos@mion.com',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
    },
  };

  test('All requests are success', async () => {
    jest
      .spyOn(BlogPosts, 'findAll')
      .mockReturnValueOnce([{ ...postStructure }]);

    const reqMock = {
      query: {
        q: 'a',
      },
    };

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.searchPost(reqMock, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      status: 'Success',
      search: [postStructure],
    });
    expect(resMock.status).toBeCalledWith(200);
    expect(resMock.status).toBeCalledTimes(1);
  });
});

describe('Delete post route', () => {
  const reqMock = {
    headers: {
      authorization: 'CCSMLNDSMD',
    },
    params: {
      id: 1,
    },
  };

  const post = {
    id: 1,
    published: new Date('2011-08-01T19:58:00.000Z'),
    updated: new Date('2011-08-01T19:58:51.947Z'),
    title: 'Latest updates, August 1st',
    content: 'The whole text for the blog post goes here in this key',
    User: {
      id: 1,
      displayName: 'Marcos Mion',
      email: 'marcos@mion.com',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
    },
  };

  test('post not exists', async () => {
    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(null);

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.deletePost(reqMock, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Post não encontrado',
      code: 'not_found',
    });
    expect(resMock.status).toBeCalledWith(404);
    expect(resMock.status).toBeCalledTimes(1);
  });

  test('user was not permission to delete post of another user', async () => {
    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(post);

    jest
      .spyOn(JWT, 'verify')
      .mockReturnValueOnce({ email: 'data@data.com' });

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.deletePost(reqMock, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Esse post é do amiguinho. N pode apagar.',
      code: 'Forbidden',
    });
    expect(resMock.status).toBeCalledWith(403);
    expect(resMock.status).toBeCalledTimes(1);
  });

  test('Successfully request', async () => {
    const destroyData = {
      ...post,
      destroy: () => jest.fn(),
    };

    jest
      .spyOn(BlogPosts, 'findOne')
      .mockReturnValueOnce(destroyData);

    jest
      .spyOn(JWT, 'verify')
      .mockReturnValueOnce({ email: 'marcos@mion.com' });

    const mockJSON = jest.fn();
    const resMock = mockRes(mockJSON);

    await services.deletePost(reqMock, resMock);

    expect(mockJSON).toBeCalledTimes(1);
    expect(mockJSON).toBeCalledWith({
      message: 'Apagado',
    });
    expect(resMock.status).toBeCalledWith(200);
    expect(resMock.status).toBeCalledTimes(1);
  });
});
