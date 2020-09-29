const services = require('../services/userServices');
const { UserModel } = require('../models');

describe('Test user Route', () => {
  test('Success request', async () => {
    jest
      .spyOn(UserModel, 'searchUser')
      .mockReturnValueOnce([]);
    // mockar retorno do service, refatorar o controller para buscar informações pelo services
    /*
    1. Criar uma camada de services, tendo uma função findOne que exerce apenas esse papel
    2. Fazer a mesma coisa para as demais
    3. Dessa forma, mockando a função, através do SpyOn ela será assistida, onde o mock ocorrerá.
    */
    const mockReq = {
      body: {
        displayName: 'Marcos Mion',
        email: 'marcos@mion.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    };

    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({
          json: {
            status: 409,
            message: 'Usuário já existe',
          },
        }),
    };

    await services.userLogin(mockReq, mockRes);
  });
});
