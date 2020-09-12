const { BlogPost } = require('../models');
const postController = require('./postController');

describe('create', () => {
  test('Se não houver o campo content, retorna erro com status 400', async () => {
    const mockReq = {
      body: {
        title: 'Minhas receitas favoritas',
      },
      user: {
        id: 5,
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    await postController.create(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith({ message: 'Campos inválidos' });
  });

  test('Se houver todos os campos, retorna mensagem de sucesso', async () => {
    const mockReq = {
      body: {
        title: 'Existe beleza na programação?',
        content: 'Programação é lindo, ponto.',
      },
      user: {
        id: 54,
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const createSpy = jest
      .spyOn(BlogPost, 'create')
      .mockReturnValueOnce();

    await postController.create(mockReq, mockRes);

    expect(createSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockJson).toBeCalledWith({ message: 'Novo post criado com sucesso' });

    createSpy.mockRestore();
  });
});

describe('getAll', () => {
  test('Retorna um array de posts', async () => {
    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockData = [
      {
        id: 7706273476706534553,
        published: '2011-08-01T19:58:00.000Z',
        updated: '2011-08-01T19:58:51.947Z',
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        user: {
          id: 401465483996,
          displayName: 'Brett Wiltshire',
          email: 'brett@email.com',
          image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
        },
      },
    ];

    const findAllSpy = jest
      .spyOn(BlogPost, 'findAll')
      .mockReturnValueOnce(mockData);

    await postController.getAll(null, mockRes);

    expect(findAllSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith(mockData);

    findAllSpy.mockRestore();
  });
});

describe('update', () => {
  test('Se não houver o campo title, retorna erro com status 400', async () => {
    const mockReq = {
      body: {
        content: 'Este é um conteúdo.',
      },
      user: {
        id: 45,
      },
      params: {
        id: 5,
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    await postController.update(mockReq, mockRes);

    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith({ message: 'Campos inválidos' });
  });

  test('Se id do usuário e id do autor não coincidirem, retorna erro com status 403', async () => {
    const mockReq = {
      body: {
        title: 'Existe beleza na programação?',
        content: 'Programação é lindo, ponto.',
      },
      user: {
        id: 54,
      },
      params: {
        id: 5,
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const findByPkSpy = jest
      .spyOn(BlogPost, 'findByPk')
      .mockReturnValueOnce({ user_id: 48 });

    await postController.update(mockReq, mockRes);

    expect(findByPkSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(403);
    expect(mockJson).toBeCalledWith({ message: 'Operação não autorizada para este usuário' });

    findByPkSpy.mockRestore();
  });

  test('Caso contrário, retorna mensagem de sucesso', async () => {
    const mockReq = {
      body: {
        title: 'Existe beleza na programação?',
        content: 'Programação é lindo, ponto.',
      },
      user: {
        id: 54,
      },
      params: {
        id: 5,
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const findByPkSpy = jest
      .spyOn(BlogPost, 'findByPk')
      .mockReturnValueOnce({ user_id: 54 });

    const updateSpy = jest
      .spyOn(BlogPost, 'update')
      .mockReturnValueOnce();

    await postController.update(mockReq, mockRes);

    expect(findByPkSpy).toBeCalledTimes(1);
    expect(updateSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith({ message: 'Post atualizado com sucesso' });

    findByPkSpy.mockRestore();
    updateSpy.mockRestore();
  });
});

describe('getById', () => {
  test('Retorna um objeto com informações do post com o respectivo id', async () => {
    const mockReq = {
      params: {
        id: 32,
      },
    };

    const mockJson = jest.fn();
    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({ json: mockJson }),
    };

    const mockData = {
      id: 32,
      published: '2011-08-01T19:58:00.000Z',
      updated: '2011-08-01T19:58:51.947Z',
      title: 'Latest updates, August 1st',
      content: 'The whole text for the blog post goes here in this key',
      user: {
        id: 401465483996,
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    };

    const findByPkSpy = jest
      .spyOn(BlogPost, 'findByPk')
      .mockReturnValueOnce(mockData);

    await postController.getById(mockReq, mockRes);

    expect(findByPkSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith(mockData);

    findByPkSpy.mockRestore();
  });
});

// describe('deleteMe', () => {
//   test('Se o usuário é deletado, retorna mensagem de sucesso', async () => {
//     const mockReq = {
//       user: { id: 5 },
//     };

//     const mockJson = jest.fn();
//     const mockRes = {
//       status: jest
//         .fn()
//         .mockReturnValueOnce({ json: mockJson }),
//     };

//     const destroySpy = jest
//       .spyOn(User, 'destroy')
//       .mockResolvedValue();

//     await userController.deleteMe(mockReq, mockRes);

//     expect(destroySpy).toBeCalledTimes(1);
//     expect(mockRes.status).toBeCalledWith(200);
//     expect(mockJson).toBeCalledWith({ message: 'Usuário deletado com sucesso' });

//     destroySpy.mockRestore();
//   });
// });
