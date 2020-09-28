const { User } = require('../models');
const {
  createNewUser,
  getAllUsers,
  getUser,
  deleteUser,
  login,
} = require('./UserController');

afterEach(() => {
  jest.clearAllMocks();
});

describe('User Controller', () => {
  describe('Criação de novo usuário', () => {
    it('Quando fornecidos dados corretos, cria um usuário no banco e retorna o status 201 e o token', async () => {
      const mockReq = {
        body: {
          displayName: 'João das Neves',
          email: 'joao@neves.com',
          password: 'joaozin',
          image: 'http://s2.glbimg.com/-6xBKH7PE0fEXFYJUsWUpsSbR2I=/s.glbimg.com/og/rg/f/original/2015/12/18/ccon-joao-das-neves-09.png',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([]);

      const mockUserModel = jest
        .spyOn(User, 'create')
        .mockResolvedValue({
          dataValues: {
            ...mockReq.body,
            id: 1,
          },
        });

      await createNewUser(mockReq, mockRes);

      expect(mockUserModel).toHaveBeenCalledTimes(1);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('token');
    });

    it('Quando o usuário já existe, retorna o erro 409 e uma mensagem', async () => {
      const mockReq = {
        body: {
          displayName: 'João das Neves',
          email: 'joao@neves.com',
          password: 'joaozin',
          image: 'http://s2.glbimg.com/-6xBKH7PE0fEXFYJUsWUpsSbR2I=/s.glbimg.com/og/rg/f/original/2015/12/18/ccon-joao-das-neves-09.png',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([{
          dataValues: {
            ...mockReq.body,
            id: 1,
          },
        }]);

      const mockUserModel = jest
        .spyOn(User, 'create')
        .mockResolvedValue({
          dataValues: {
            ...mockReq.body,
            id: 1,
          },
        });

      await createNewUser(mockReq, mockRes);

      expect(mockUserModel).not.toHaveBeenCalled();
      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(409);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('Usuário já existe');
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockReq = {
        body: {
          displayName: 'João das Neves',
          email: 'joao@neves.com',
          password: 'joaozin',
          image: 'http://s2.glbimg.com/-6xBKH7PE0fEXFYJUsWUpsSbR2I=/s.glbimg.com/og/rg/f/original/2015/12/18/ccon-joao-das-neves-09.png',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([]);

      const mockUserModel = jest
        .spyOn(User, 'create')
        .mockRejectedValue(new Error());

      await createNewUser(mockReq, mockRes);

      expect(mockUserModel).toHaveBeenCalledTimes(1);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });

  describe('Exibir informações de todos os usuários', () => {
    it('Quando é feita uma requisição GET para o endpoint /user retorna um array com os detalhes de todos os usuários sem a senha', async () => {
      const mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([
          {
            id: 1,
            displayName: 'Guilherme Crespo',
            email: 'gui@gui.com',
            image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
          },
          {
            id: 5,
            displayName: 'Alan Parsons',
            email: 'alan@alan.com',
            image: 'https://www.gannett-cdn.com/-mm-/3690a3782bc4a2b9b35fc50bf175c54642c2ca9d/c=0-9-2968-3966/local/-/media/2016/03/22/Phoenix/Phoenix/635942084911874569-GettyImages-464294501.jpg?width=534&height=712&fit=crop',
          },
          {
            id: 6,
            displayName: 'Guilherme Crespo',
            email: 'gui@crespo.com',
            image: 'https://midias.folhavitoria.com.br/files/2016/07/frnacieli-e-guilherme-crespo-2.jpg',
          },
        ]);

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await getAllUsers(null, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON.mock.calls[0][0]).toBeInstanceOf(Array);
      mockJSON.mock.calls[0][0].forEach((user) => expect(user).not.toHaveProperty('password'));
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockRejectedValue(new Error());

      await getAllUsers(null, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });

  describe('Exibir informações de um usuário', () => {
    it('Quando é feita uma requisição GET para o endpoint /user/:id retorna um objeto com os detalhes do usuário com id correspondente sem a senha', async () => {
      const result = {
        id: 1,
        displayName: 'Guilherme Crespo',
        email: 'gui@gui.com',
        image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
      };

      const mockFindUser = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([result]);

      const mockReq = {
        params: {
          id: 1,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await getUser(mockReq, mockRes);

      expect(mockFindUser).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON.mock.calls[0][0]).toStrictEqual(result);
      expect(mockJSON.mock.calls[0][0]).not.toHaveProperty('password');
    });

    it('Quando não é encontrado nenhum usuário, retorna o status 404 e uma mensagem', async () => {
      const mockFindUser = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([]);

      const mockReq = {
        params: {
          id: 10,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await getUser(mockReq, mockRes);

      expect(mockFindUser).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(404);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('usuário não encontrado');
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
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

      await getUser(mockReq, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });

  describe('Deletar um usuário', () => {
    it('Quando o usuário logado manda um requisição DELETE para o endpoint /user/me retorna um status 200', async () => {
      const mockReq = {
        user: {
          id: 1,
        },
      };

      const mockRes = {
        status: jest.fn().mockImplementation(() => ({ end: jest.fn() })),
      };

      const mockDestroy = jest
        .spyOn(User, 'destroy')
        .mockResolvedValue();

      await deleteUser(mockReq, mockRes);

      expect(mockDestroy).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
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

      await deleteUser(mockReq, mockRes);

      expect(mockDestroy).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });

  describe('Login usuário', () => {
    it('Quando um usuário insere os dados corretamente, é logado e retorna um status 200 e o token', async () => {
      const result = {
        dataValues: {
          id: 1,
          displayName: 'Guilherme Crespo',
          password: '123456',
          email: 'gui@gui.com',
          image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
        },
      };

      const mockReq = {
        body: {
          email: 'gui@gui.com',
          password: '123456',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([result]);

      await login(mockReq, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('token');
    });

    it('Quando um usuário insere os dados com um dos campos em branco, a aplicação retorna o status 400 e uma mensagem de erro', async () => {
      const mockReqEmail = {
        body: {
          email: 'gui@gui.com',
          password: '',
        },
      };

      const mockReqPassword = {
        body: {
          email: '',
          password: '123456',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await login(mockReqEmail, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('campos inválidos');

      await login(mockReqPassword, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('campos inválidos');
    });

    it('Quando o usuário não existe ou a senha está incorreta, a aplicação retorna o status 400 e uma mensagem de erro', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const result = {
        id: 1,
        displayName: 'Guilherme Crespo',
        password: '123456',
        email: 'gui@gui.com',
        image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
      };

      const mockNotFoundEmail = {
        body: {
          email: 'gui@asd.com',
          password: '123456',
        },
      };

      const mockIncorrectPassword = {
        body: {
          email: 'gui@asd.com',
          password: 'asd',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      let mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([]);

      await login(mockNotFoundEmail, mockRes);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('Senha ou usuário incorretos, tente novamente');

      mockFindAll.mockClear();

      mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockResolvedValue([result]);

      await login(mockIncorrectPassword, mockRes);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('Senha ou usuário incorretos, tente novamente');
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockReq = {
        body: {
          email: 'gui@gui.com',
          password: '123456',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockFindAll = jest
        .spyOn(User, 'findAll')
        .mockRejectedValue(new Error());

      await login(mockReq, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });
});
