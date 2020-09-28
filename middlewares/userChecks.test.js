const jwt = require('jsonwebtoken');
const userChecks = require('./userChecks');

afterEach(() => {
  jest.clearAllMocks();
});

describe('testes dos middlewares do usuário', () => {
  describe('teste das regras de negócio relativas aos campos de criação do usuário', () => {
    it('Quando inseridos os dados corretamente, chama a função next()', async () => {
      const mockReq = {
        body: {
          displayName: 'João das Neves',
          email: 'joao@neves.com',
          password: 'joaozin',
          image: 'http://s2.glbimg.com/-6xBKH7PE0fEXFYJUsWUpsSbR2I=/s.glbimg.com/og/rg/f/original/2015/12/18/ccon-joao-das-neves-09.png',
        },
      };

      const mockNext = jest.fn();

      await userChecks.checkCreateFields(mockReq, null, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('Quando algum dos dados é inserido incorretamente, a aplicação retorna o status 400 e uma mensagem de erro', async () => {
      const mockReqInvalidName = {
        body: {
          displayName: 'João',
          email: 'joao@neves.com',
          password: 'joaozin',
          image: 'http://s2.glbimg.com/-6xBKH7PE0fEXFYJUsWUpsSbR2I=/s.glbimg.com/og/rg/f/original/2015/12/18/ccon-joao-das-neves-09.png',
        },
      };

      const mockReqInvalidEmail = {
        body: {
          displayName: 'João das Neves',
          email: 'joao@',
          password: 'joaozin',
          image: 'http://s2.glbimg.com/-6xBKH7PE0fEXFYJUsWUpsSbR2I=/s.glbimg.com/og/rg/f/original/2015/12/18/ccon-joao-das-neves-09.png',
        },
      };

      const mockReqInvalidPassword = {
        body: {
          displayName: 'João das Neves',
          email: 'joao@neves.com',
          password: 'joaoz',
          image: 'http://s2.glbimg.com/-6xBKH7PE0fEXFYJUsWUpsSbR2I=/s.glbimg.com/og/rg/f/original/2015/12/18/ccon-joao-das-neves-09.png',
        },
      };

      const mockReqInvalidImage = {
        body: {
          displayName: 'João das Neves',
          email: 'joao@neves.com',
          password: 'joaoz',
          image: 123,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockNext = jest.fn();

      await userChecks.checkCreateFields(mockReqInvalidName, mockRes, mockNext);

      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message)
        .toBe('dados inválidos: Preencha todos os campos / seu nome deve conter ao menos 8 caracteres / sua senha deve ter 6 caracteres');
      expect(mockNext).not.toHaveBeenCalled();

      await userChecks.checkCreateFields(mockReqInvalidEmail, mockRes, mockNext);

      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message)
        .toBe('dados inválidos: Preencha todos os campos / seu nome deve conter ao menos 8 caracteres / sua senha deve ter 6 caracteres');
      expect(mockNext).not.toHaveBeenCalled();

      await userChecks.checkCreateFields(mockReqInvalidPassword, mockRes, mockNext);

      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message)
        .toBe('dados inválidos: Preencha todos os campos / seu nome deve conter ao menos 8 caracteres / sua senha deve ter 6 caracteres');
      expect(mockNext).not.toHaveBeenCalled();

      await userChecks.checkCreateFields(mockReqInvalidImage, mockRes, mockNext);

      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message)
        .toBe('dados inválidos: Preencha todos os campos / seu nome deve conter ao menos 8 caracteres / sua senha deve ter 6 caracteres');
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('teste da autentificação do usuário', () => {
    it('Quando não há token nos headers: authorization retorna status 401 e uma mensagem', async () => {
      const mockReq = {
        headers: {
          authorization: null,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockNext = jest.fn();

      await userChecks.authUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toBeCalledWith(401);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('operação não autorizada, token não encontrado');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Quando o token é inválido, retorna status 401 e uma mensagem', async () => {
      const mockReq = {
        headers: {
          authorization: 'sdfsdfs',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockNext = jest.fn();

      jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error(); });

      await userChecks.authUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toBeCalledWith(401);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('operação não autorizada, token inválido');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('Quando o token é válido, chama função next', async () => {
      const mockReq = {
        headers: {
          authorization: 'sdfsdfs',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockNext = jest.fn();

      jest.spyOn(jwt, 'verify').mockReturnValue({
        id: 123,
        displayName: 'João das Neves',
        email: 'joao@neves.com',
        image: 'www.joao.com',
      });

      await userChecks.authUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
