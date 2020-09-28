const { Post, User } = require('../models');
const postsController = require('./posts');

// agradeço a guicgs por me ajudar nos testes de erro 500.

afterEach(() => {
  jest.restoreAllMocks();
});

describe.skip('createPost', () => {
  test('post without title', async () => {
    const mockReq = {
      user: {
        dataValues: {
          id: 1,
        },
      },
      body: {
        title: '',
        content: 'some content',
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

    await postsController.createPost(mockReq, mockRes);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith(mockData);
  });
  test('valid data. creating post', async () => {
    const mockReq = {
      user: {
        dataValues: {
          id: 1,
        },
      },
      body: {
        title: 'my title',
        content: 'some content',
      },
    };
    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    const date = new Date();

    const mockPostModel = jest
      .spyOn(Post, 'create')
      .mockResolvedValue({
        ...mockReq.body,
        id: 1,
        userId: 1,
        updated: date,
        published: date,
      });

    await postsController.createPost(mockReq, mockRes);

    expect(mockPostModel).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJSON).toBeCalledWith(
      {
        title: 'my title',
        content: 'some content',
      },
    );
  });
  test('Error 500', async () => {
    jest.spyOn(console, 'error').mockReturnValueOnce();

    const mockReq = {
      body: {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
      },
      user: {
        dataValues: {
          id: 1,
        },
      },
    };

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    const mockUserModel = jest
      .spyOn(Post, 'create')
      .mockRejectedValue(new Error());

    await postsController.createPost(mockReq, mockRes);

    expect(mockUserModel).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});

describe.skip('listPosts', () => {
  test('listing all posts', async () => {
    // mock copiado para facilitar os testes
    const mockFindAll = jest
      .spyOn(Post, 'findAll')
      .mockResolvedValue([
        {
          id: 1,
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
          published: '2020-09-22T16:30:25.000Z',
          updated: '2020-09-22T16:30:25.000Z',
          user: {
            id: 1,
            displayName: 'Guilherme Crespo',
            email: 'gui@gui.com',
            password: '123456',
            image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
          },
        },
        {
          id: 3,
          title: 'Latest updates, August 2st',
          content: 'The whole text for the blog post goes here in this key lalala',
          published: '2020-09-25T16:44:28.000Z',
          updated: '2020-09-25T16:44:28.000Z',
          user: {
            id: 1,
            displayName: 'Guilherme Crespo',
            email: 'gui@gui.com',
            password: '123456',
            image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
          },
        },
        {
          id: 4,
          title: 'Latest updates, August ast',
          content: 'The whole text for the blog post goes here in this key alanal',
          published: '2020-09-28T00:24:06.000Z',
          updated: '2020-09-28T00:24:06.000Z',
          user: {
            id: 5,
            displayName: 'Alan Parsons',
            email: 'alan@alan.com',
            password: 'alanal',
            image: 'https://www.gannett-cdn.com/-mm-/3690a3782bc4a2b9b35fc50bf175c54642c2ca9d/c=0-9-2968-3966/local/-/media/2016/03/22/Phoenix/Phoenix/635942084911874569-GettyImages-464294501.jpg?width=534&height=712&fit=crop',
          },
        },
      ]);

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await postsController.listPosts(null, mockRes);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJSON.mock.calls[0][0]).toBeInstanceOf(Array);
  });
  test('Error 500', async () => {
    jest.spyOn(console, 'error').mockReturnValueOnce();

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    const mockUserModel = jest
      .spyOn(Post, 'findAll')
      .mockRejectedValue(new Error());

    await postsController.listPosts(null, mockRes);

    expect(mockUserModel).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});

describe.skip('listPost', () => {
  test('listing single post', async () => {
    const result = {
      id: 1,
      title: 'Latest updates, October 1st',
      content: 'The whole text for the blog post goes here in this key',
      published: '2020-09-22T16:30:25.000Z',
      updated: '2020-09-28T01:18:53.000Z',
      user: {
        id: 1,
        displayName: 'Lula da Silva',
        email: 'lulalivre@pt.com',
        image: 'img.png',
      },
    };

    const mockFindUser = jest
      .spyOn(Post, 'findOne')
      .mockResolvedValue(result);

    const mockReq = {
      params: {
        id: 1,
      },
    };

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await postsController.listPost(mockReq, mockRes);

    expect(mockFindUser).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJSON.mock.calls[0][0]).toStrictEqual(result);
    expect(mockJSON.mock.calls[0][0].user).not.toHaveProperty('password');
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

    const mockUserModel = jest
      .spyOn(Post, 'findOne')
      .mockRejectedValue(new Error());

    await postsController.listPost(mockReq, mockRes);

    expect(mockUserModel).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});

describe.skip('updatePost', () => {
  test('post missing data', async () => {
    const mockReq = {
      params: {
        id: 1,
      },
      user: {
        dataValues: {
          id: 1,
        },
      },
      body: {
        title: '',
        content: 'some content',
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

    await postsController.updatePost(mockReq, mockRes);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith(mockData);
  });
  test('Different user', async () => {
    const mockReq = {
      body: {
        title: 'Latest updates, September 28th',
        content: 'The whole text for the blog post goes here in this key',
      },
      user: {
        id: 5,
      },
      params: {
        id: 4,
      },
    };

    const mockJSON = jest.fn();

    const mockFindOne = jest
      .spyOn(Post, 'findByPk')
      .mockResolvedValue({
        ...mockReq.body,
        id: mockReq.params.id,
        userId: mockReq.user.id,
        updated: '2020-09-22 16:30:25',
        published: '2020-09-22 16:30:25',
      });

    // search results:
    // {
    //   dataValues: {
    //     id: 1,
    //     title: 'post for jest3',
    //     content: 'single post as an example3',
    //     published: 2011-08-01T19:58:00.000Z,
    //     updated: 2020-09-28T21:07:41.000Z,
    //     userId: 1
    //   },
    //   _previousDataValues: {
    //     id: 1,
    //     title: 'post for jest3',
    //     content: 'single post as an example3',
    //     published: 2011-08-01T19:58:00.000Z,
    //     updated: 2020-09-28T21:07:41.000Z,
    //     userId: 1
    //   },
    //   _changed: Set(0) {},
    //   _options: {
    //     isNewRecord: false,
    //     _schema: null,
    //     _schemaDelimiter: '',
    //     raw: true,
    //     attributes: [ 'id', 'title', 'content', 'published', 'updated', 'userId' ]
    //   },
    //   isNewRecord: false
    // }


    //   {
    //     "id": 7,
    //     "title": "post for jest",
    //     "content": "single post as an example",
    //     "published": "2020-09-28T21:05:47.000Z",
    //     "updated": "2020-09-28T21:05:47.000Z",
    //     "user": {
    //         "id": 3,
    //         "displayName": "admin",
    //         "email": "admin@gmail.com",
    //         "image": "xablau.jpg"
    //     }
    // }

    const mockPostModel = jest
      .spyOn(Post, 'update')
      .mockResolvedValue();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await postsController.updatePost(mockReq, mockRes);

    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockPostModel).not.toHaveBeenCalled();
    expect(mockRes.status).toBeCalledWith(403);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('User unauthorized to update post');
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
      .spyOn(Post, 'update')
      .mockRejectedValue(new Error());

    await postsController.updatePost(mockReq, mockRes);

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});

describe.skip('searchPost', () => {
  test('Searching for post by query params', async () => {
    const mockReq = {
      query: {
        q: 'searched',
      },
    };

    const mockResult = [
      {
        id: 1,
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        published: '2020-09-22T16:30:25.000Z',
        updated: '2020-09-22T16:30:25.000Z',
        user: {
          id: 1,
          displayName: 'Guilherme Crespo',
          email: 'gui@gui.com',
          password: '123456',
          image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
        },
      },
      {
        id: 3,
        title: 'Latest updates, August 2st',
        content: 'The whole text for the blog post goes here in this key searched',
        published: '2020-09-25T16:44:28.000Z',
        updated: '2020-09-25T16:44:28.000Z',
        user: {
          id: 1,
          displayName: 'Guilherme Crespo',
          email: 'gui@gui.com',
          password: '123456',
          image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
        },
      },
      {
        id: 4,
        title: 'Latest updates, August ast',
        content: 'The whole text for the blog post goes here in this key alanal',
        published: '2020-09-28T00:24:06.000Z',
        updated: '2020-09-28T00:24:06.000Z',
        user: {
          id: 5,
          displayName: 'Alan Parsons',
          email: 'alan@alan.com',
          password: 'alanal',
          image: 'https://www.gannett-cdn.com/-mm-/3690a3782bc4a2b9b35fc50bf175c54642c2ca9d/c=0-9-2968-3966/local/-/media/2016/03/22/Phoenix/Phoenix/635942084911874569-GettyImages-464294501.jpg?width=534&height=712&fit=crop',
        },
      },
    ];

    const mockJSON = jest.fn();

    const mockFindAll = jest
      .spyOn(Post, 'findAll')
      .mockResolvedValue(mockResult);

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await postsController.searchPost(mockReq, mockRes);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJSON).toBeCalledWith(mockResult);
    expect(mockJSON.mock.calls[0][0]).toBeInstanceOf(Array);
    mockJSON.mock.calls[0][0].forEach((post) => expect(post).not.toHaveProperty('userId'));
  });
  test('404 error', async () => {
    const mockReq = {
      query: {
        q: 'lalalal',
      },
    };

    const mockJSON = jest.fn();

    const mockFindAll = jest
      .spyOn(Post, 'findAll')
      .mockResolvedValue();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    await postsController.searchPost(mockReq, mockRes);

    expect(mockFindAll).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('Post not found');
  });
  test('error 500', async () => {
    jest.spyOn(console, 'error').mockReturnValueOnce();

    const mockReq = {
      query: {
        q: 'lalalal',
      },
    };

    const mockJSON = jest.fn();

    const mockRes = {
      status: jest.fn().mockReturnValue({ json: mockJSON }),
    };

    const mockDestroy = jest
      .spyOn(Post, 'findAll')
      .mockRejectedValue(new Error());

    await postsController.searchPost(mockReq, mockRes);

    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
    expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
  });
});

describe.skip('deletePost', () => {
  test.only('deleting post', async () => {
    const mockReq = {
      user: {
        id: 5,
      },
      params: {
        id: 4,
      },
    };

    const mockFindOne = jest
      .spyOn(Post, 'findByPk')
      .mockResolvedValue({
        id: 4,
        title: 'Latest updates, October 1st',
        content: 'The whole text for the blog post goes here in this key alanal ast',
        published: '2020-09-22T16:30:25.000Z',
        updated: '2020-09-28T01:18:53.000Z',
        user: {
          id: 5,
          displayName: 'Guilherme Crespo',
          email: 'gui@gui.com',
          password: '123456',
          image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
        },
      });

    const mockDestroy = jest
      .spyOn(Post, 'destroy')
      .mockResolvedValue(true);

    const mockRes = {
      status: jest.fn().mockImplementation(() => ({ end: jest.fn() })),
    };

    await postsController.deletePost(mockReq, mockRes);

    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
  });
});

// describe.skip.skip('users route', () => {
//   test('usersController.CreateUser controller', async () => {
//     const reqMock = {
//       body: {
//         displayName: 'user 1',
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
