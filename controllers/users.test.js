const { createUser } = require('./users');

describe('users route', () => {
  test('CreateUser controller', async () => {
    const reqMock = {
      body: {
        displayName: 'k6',
        email: 'k6@mailist.com',
        password: 'tulin',
        image: 'xablau.jpg',
      },
    };
    const resMock = {
      status: jest.fn().mockReturnValueOnce({
        token: 'xablau', // mock da geração do token?
      }),
    };
    await createUser(reqMock, resMock, jest.fn());
  });
});
