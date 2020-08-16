const userController = require('./UserController');
const userService = require('../services/UserService');

describe('Testing User Controller', () => {
  describe('Testing New User in POST Method.', async () => {
    test('Verify if invalid body catch\'s error.', async () => {
      // Arrange
      const errorMock = {
        error: {
          message: 'Dados inválidos',
          code: 'Invalid_data',
        },
      };

      const mockReq = {
        name: 'Felipe',
        email: 'lipe@.lipe.com',
        password: '123456',
      };

      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: jest.fn() })};

      // Act
      await userController.
      // Assert
    });
  });
});
