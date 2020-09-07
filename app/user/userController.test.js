const userController = require('./userController');

const faker = require('faker');

describe('User Controller', () => {
  describe('Create User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockDataUserSent = {
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        password: faker.internet.password(),
      };

      const mockDataUserReceived = {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        displayName: mockDataUserSent.displayName,
      };

      const mockDataTokenReceived = faker.random.hexaDecimal();

      const mockUser = jest.fn().mockReturnValue({
        create: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUserReceived, token: mockDataTokenReceived, error: null });
          }),
      });

      const mockReq = { body: mockDataUserSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.create({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({
        user: mockDataUserReceived,
        token: mockDataTokenReceived,
      });
    });

    it('on failure - user exists', async () => {
      const mockUserModel = jest.fn();

      const mockDataUserSent = {
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

      const mockReq = { body: mockDataUserSent };

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
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataUserReceived = {
        id: mockId,
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockUser = jest.fn().mockReturnValue({
        find: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUserReceived, error: null });
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

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUserReceived });
    });

    it('on failure - user not found', async () => {
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

  describe('List User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const createUser = () => ({
        id: faker.random.number(),
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      });

      const mockDataUserReceived = new Array(10).fill(undefined).map(createUser);

      const mockUser = jest.fn().mockReturnValue({
        list: async () =>
          new Promise((resolve, _reject) => {
            resolve(mockDataUserReceived);
          }),
      });

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.list({ User: mockUser, userModel: mockUserModel });

      await act(null, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ users: mockDataUserReceived });
    });
  });

  describe('Login User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockDataUserSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockDataUserReceived = {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockDataTokenReceived = faker.random.hexaDecimal();

      const mockUser = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUserReceived, token: mockDataTokenReceived, error: null });
          }),
      });

      const mockReq = { body: mockDataUserSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.login({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({
        user: mockDataUserReceived,
        token: mockDataTokenReceived,
      });
    });

    it('on failure - user not found', async () => {
      const mockUserModel = jest.fn();

      const mockDataUserSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUser = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'exists' });
          }),
      });

      const mockReq = { body: mockDataUserSent };

      const mockRes = jest.fn();

      const act = userController.login({ User: mockUser, userModel: mockUserModel });

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

    it('on failure - wrong password', async () => {
      const mockUserModel = jest.fn();

      const mockDataUserSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUser = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'wrongPassword' });
          }),
      });

      const mockReq = { body: mockDataUserSent };

      const mockRes = jest.fn();

      const act = userController.login({ User: mockUser, userModel: mockUserModel });

      try {
        await act(mockReq, mockRes);
      } catch (err) {
        const {
          output: {
            payload: { statusCode, message },
          },
        } = err;

        expect(statusCode).toBe(400);

        expect(message).toBe('Senha incorreta');
      } finally {
        expect(mockUser).toHaveBeenCalledTimes(1);

        expect(mockUser).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockUserModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Remove User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockId = faker.random.number();

      const mockUser = jest.fn().mockReturnValue({
        remove: async () => new Promise((resolve, _reject) => resolve()),
      });

      const mockReq = { params: { id: mockId } };

      const mockEnd = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ end: mockEnd }) };

      const act = userController.remove({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({ userModel: mockUserModel, id: mockId });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(204);

      expect(mockEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update User', () => {
    it('on success', async () => {
      const mockUserModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataUserSent = {
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockDataUserReceived = {
        id: mockId,
        email: faker.internet.email(),
        displayName: mockDataUserSent.displayName,
        image: mockDataUserSent.image,
      };

      const mockUser = jest.fn().mockReturnValue({
        update: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUserReceived, error: null });
          }),
      });

      const mockReq = { params: { id: mockId }, body: mockDataUserSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.update({ User: mockUser, userModel: mockUserModel });

      await act(mockReq, mockRes);

      expect(mockUser).toHaveBeenCalledTimes(1);

      expect(mockUser).toHaveBeenCalledWith({
        id: mockId,
        userModel: mockUserModel,
        ...mockReq.body,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUserReceived });
    });

    it('on failure - user not found', async () => {
      const mockUserModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataUserSent = {
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockUser = jest.fn().mockReturnValue({
        update: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, error: 'notFound' });
          }),
      });

      const mockReq = { params: { id: mockId }, body: mockDataUserSent };

      const mockRes = jest.fn();

      const act = userController.update({ User: mockUser, userModel: mockUserModel });

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

        expect(mockUser).toHaveBeenCalledWith({
          id: mockId,
          userModel: mockUserModel,
          ...mockReq.body,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });
});
