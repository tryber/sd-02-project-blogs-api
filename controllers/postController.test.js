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

// describe('getAll', () => {
//   test('Retorna todos os usuários sem o campo password', async () => {
//     const mockJson = jest.fn();
//     const mockRes = {
//       status: jest
//         .fn()
//         .mockReturnValueOnce({ json: mockJson }),
//     };

//     const mockData = [
//       {
//         id: 1,
//         displayName: 'Brett Wiltshire',
//         email: 'brett@email.com',
//         password: '123456',
//         image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
//       },
//     ];

//     const mockUsers = [
//       {
//         id: 1,
//         displayName: 'Brett Wiltshire',
//         email: 'brett@email.com',
//         image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
//       },
//     ];

//     const findAllSpy = jest
//       .spyOn(User, 'findAll')
//       .mockReturnValueOnce(mockData);

//     await userController.getAll(null, mockRes);

//     expect(findAllSpy).toBeCalledTimes(1);
//     expect(mockRes.status).toBeCalledWith(200);
//     expect(mockJson).toBeCalledWith(mockUsers);

//     findAllSpy.mockRestore();
//   });
// });

// describe('getById', () => {
//   test('Se usuário não existe, retorna erro com status 404', async () => {
//     const mockReq = {
//       params: { id: 4500 },
//     };

//     const mockJson = jest.fn();
//     const mockRes = {
//       status: jest
//         .fn()
//         .mockReturnValueOnce({ json: mockJson }),
//     };

//     const findByPkSpy = jest
//       .spyOn(User, 'findByPk')
//       .mockReturnValueOnce(null);

//     await userController.getById(mockReq, mockRes);

//     expect(findByPkSpy).toBeCalledTimes(1);
//     expect(mockRes.status).toBeCalledWith(404);
//     expect(mockJson).toBeCalledWith({ message: 'Usuário não encontrado' });

//     findByPkSpy.mockRestore();
//   });

//   test('Se usuário não existe, retorna erro com status 404', async () => {
//     const mockReq = {
//       params: { id: 1 },
//     };

//     const mockJson = jest.fn();
//     const mockRes = {
//       status: jest
//         .fn()
//         .mockReturnValueOnce({ json: mockJson }),
//     };

//     const mockUser = {
//       id: 1,
//       displayName: 'Brett Wiltshire',
//       email: 'brett@email.com',
//       image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
//     };

//     const findByPkSpy = jest
//       .spyOn(User, 'findByPk')
//       .mockReturnValueOnce(mockUser);

//     await userController.getById(mockReq, mockRes);

//     expect(findByPkSpy).toBeCalledTimes(1);
//     expect(mockRes.status).toBeCalledWith(200);
//     expect(mockJson).toBeCalledWith(mockUser);

//     findByPkSpy.mockRestore();
//   });
// });

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

// describe('login', () => {
//   test('Se o campo password não tiver 6 caracteres, retorna mensagem de erro', async () => {
//     const mockReq = {
//       body: {
//         email: 'thiagosilva@gmail.com',
//         password: '1234567',
//       },
//     };

//     const mockJson = jest.fn();
//     const mockRes = {
//       status: jest
//         .fn()
//         .mockReturnValueOnce({ json: mockJson }),
//     };

//     await userController.login(mockReq, mockRes);

//     expect(mockRes.status).toBeCalledWith(400);
//     expect(mockJson).toBeCalledWith({ message: 'Campos inválidos' });
//   });

//   test('Se não existir um usuário com email e password informados, retorna mensagem de erro', async () => {
//     const mockReq = {
//       body: {
//         email: 'thiagosilva@gmail.com',
//         password: '123456',
//       },
//     };

//     const mockJson = jest.fn();
//     const mockRes = {
//       status: jest
//         .fn()
//         .mockReturnValueOnce({ json: mockJson }),
//     };

//     const findOneSpy = jest
//       .spyOn(User, 'findOne')
//       .mockReturnValueOnce(null);

//     await userController.login(mockReq, mockRes);

//     expect(findOneSpy).toBeCalledTimes(1);
//     expect(mockRes.status).toBeCalledWith(400);
//     expect(mockJson).toBeCalledWith({ message: 'Campos inválidos' });

//     findOneSpy.mockRestore();
//   });

//   test('Se o usuário é encontrado, retorna um token', async () => {
//     const mockReq = {
//       body: {
//         email: 'thiagosilva@gmail.com',
//         password: '123456',
//       },
//     };

//     const mockJson = jest.fn();
//     const mockRes = {
//       status: jest
//         .fn()
//         .mockReturnValueOnce({ json: mockJson }),
//     };

//     const findOneSpy = jest
//       .spyOn(User, 'findOne')
//       .mockReturnValueOnce({
//         dataValues: {
//           id: 16,
//           displayName: 'Thiago Silva',
//           email: 'thiagosilva@gmail.com',
//           password: '123456',
//           image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
//         },
//       });

//     const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsImRpc3BsYXlOYW1lIjoiVGhpYWdvIFNpbHZhIiwiZW1haWwiOiJ0aGlhZ29zaWx2YUBnbWFpbC5jb20iLCJpbWFnZSI6Imh0dHA6Ly80LmJwLmJsb2dzcG90LmNvbS9fWUE1MGFkUS03dlEvUzFnZlJfNnVmcEkvQUFBQUFBQUFBQWsvMUVySkdnUldaRGcvUzQ1L2JyZXR0LnBuZyIsImlhdCI6MTU5OTQ3Mjg3NSwiZXhwIjoxNTk5NDc1ODc1fQ.-OCJAeGARIaApQlQwYFOa8v59wGo3vYQ6jTjukKfmus';

//     const signSpy = jest
//       .spyOn(jwt, 'sign')
//       .mockReturnValueOnce(mockToken);

//     const mockData = {
//       token: mockToken,
//     };

//     await userController.login(mockReq, mockRes);

//     expect(findOneSpy).toBeCalledTimes(1);
//     expect(signSpy).toBeCalledTimes(1);
//     expect(mockRes.status).toBeCalledWith(200);
//     expect(mockJson).toBeCalledWith(mockData);

//     findOneSpy.mockRestore();
//     signSpy.mockRestore();
//   });
// });
