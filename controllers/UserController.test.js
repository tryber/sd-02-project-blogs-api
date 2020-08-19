const { User } = require('../models');
const { createNewUser } = require('./UserController');

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
});
