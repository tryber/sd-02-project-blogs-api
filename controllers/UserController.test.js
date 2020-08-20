const { User } = require('../models');
const { createNewUser, getAllUsers } = require('./UserController');

afterEach(() => {
  jest.clearAllMocks();
});

describe('User Controller', () => {
  describe('Criação de novo usuário', () => {
    it('Quando fornecidos dados corretos, cria um usuário no banco e retorna o status 200 e o token', async () => {
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
});
