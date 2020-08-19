const { User } = require('../models');
const { createNewUser } = require('./UserController');

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

      const mockUserModel = jest.spyOn(User, 'create');

      await createNewUser(mockReq, mockRes);

      expect(mockUserModel).toBeCalledOnce();
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('token');
    });
  });
});
