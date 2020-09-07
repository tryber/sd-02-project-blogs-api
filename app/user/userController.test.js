const userController = require('./userController');
const faker = require('faker');

describe('User Controller', () => {
  describe('Create User', () => {
    test('with no image', async () => {
      const mockUserModel = jest.fn();

      const mockDataUser = {
        id: faker.random.number(),
        email: faker.internet.email(),
        displayName: faker.name.findName(),
      };

      const mockDataToken = faker.random.hexaDecimal();

      const mockUser = jest.fn().mockReturnValue({
        create: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUser, token: mockDataToken, error: null });
          }),
      });

      const mockReq = { body: mockDataUser };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.create({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

      expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUser, token: mockDataToken });
    });
  });
  describe('Find User', () => {});
  describe('List User', () => {});
  describe('Remove User', () => {});
  describe('Search User', () => {});
  describe('Update User', () => {});
});
