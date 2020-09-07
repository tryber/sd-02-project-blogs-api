const userController = require('./userController');
const faker = require('faker');

describe('User Controller', () => {
  describe('Create User', () => {
    test('on sucess', async () => {
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

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUser, token: mockDataToken });
    });

    test('on failure - user exists', async () => {
      const mockUserModel = jest.fn();

      const mockDataUser = {
        id: faker.random.number(),
        email: faker.internet.email(),
        displayName: faker.name.findName(),
      };

      const mockUser = jest.fn().mockReturnValue({
        create: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'exists' });
          }),
      });

      const mockReq = { body: mockDataUser };

      const mockRes = jest.fn();

      const act = userController.create({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Usuário já existe');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Find User', () => {
    test('on sucess', async () => {
      const mockUserModel = jest.fn();

      const mockDataUser = {
        id: faker.random.number(),
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockId = faker.random.number();

      const mockUser = jest.fn().mockReturnValue({
        find: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUser, error: null });
          }),
      });

      const mockReq = { params: { id: mockId } };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.find({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ id: mockId, userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUser });
    });

    test('on failure - user exists', async () => {
      const mockUserModel = jest.fn();

      const mockId = faker.random.number();

      const mockUser = jest.fn().mockReturnValue({
        find: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, error: 'notFound' });
          }),
      });

      const mockReq = { params: { id: mockId } };

      const mockRes = jest.fn();

      const act = userController.find({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Usuário não encontrado');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ id: mockId, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });
  describe('List User', () => {});
  describe('Remove User', () => {});
  describe('Search User', () => {});
  describe('Update User', () => {});
});
