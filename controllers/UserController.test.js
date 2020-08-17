const userController = require('./UserController');
const errorController = require('./errorController');

describe('Testing User Controller', () => {
  describe('Testing New User in POST Method.', () => {
    test('Verify if rescue catch\'s invalid body with JoI.', async () => {
      // Arrange
      const errorMock = {
        error: {
          message: '\"displayName\" length must be at least 8 characters long',
          code: 'Invalid_data',
        },
      };

      const mockReq = {
        body: {
          displayName: 'Felipe',
          email: 'lipe@lipe.com',
          password: '123456789',
        },
      };

      const nextMock = jest.fn();
      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      // Act
      await errorController(errorMock, null, mockRes);
      await userController.newUser(mockReq, mockRes, nextMock);

      // Assert
      expect(nextMock).toBeCalledWith(errorMock);
      expect(mockRes.status).toBeCalledWith(422);
    });
  });
});
