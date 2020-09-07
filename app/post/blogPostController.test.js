const blogPostController = require('./blogPostController');

const faker = require('faker');

describe('User Controller', () => {
  describe('Create User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataBlogPost

      const mockDataBlogPost = {
        id: faker.random.number(),
        user_id: faker.random.number(),
        title: faker.name.title(),
        content: faker.lorem.text(),
        updatedAt: new Date(),
        createdAt: new Date(),
        published: new Date(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        create: async () =>
          new Promise((resolve, _reject) => {
            resolve(mockDataBlogPost);
          }),
      });

      const mockReq = { body: mockDataUser };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.create({ User: mockBlogPost, userModel: mockBlogPostModel });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUser, token: mockDataToken });
    });

    it('on failure - user exists', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataUser = {
        id: faker.random.number(),
        email: faker.internet.email(),
        displayName: faker.name.findName(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        create: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'exists' });
          }),
      });

      const mockReq = { body: mockDataUser };

      const mockRes = jest.fn();

      const act = userController.create({ User: mockBlogPost, userModel: mockBlogPostModel });

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
        expect(mockBlogPost).toHaveBeenCalledTimes(1);

        expect(mockBlogPost).toHaveBeenCalledWith({
          ...mockReq.body,
          userModel: mockBlogPostModel,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Find User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataUser = {
        id: mockId,
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        find: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUser, error: null });
          }),
      });

      const mockReq = { params: { id: mockId } };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.find({ User: mockBlogPost, userModel: mockBlogPostModel });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ id: mockId, userModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUser });
    });

    it('on failure - user not found', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockBlogPost = jest.fn().mockReturnValue({
        find: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, error: 'notFound' });
          }),
      });

      const mockReq = { params: { id: mockId } };

      const mockRes = jest.fn();

      const act = userController.find({ User: mockBlogPost, userModel: mockBlogPostModel });

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
        expect(mockBlogPost).toHaveBeenCalledTimes(1);

        expect(mockBlogPost).toHaveBeenCalledWith({ id: mockId, userModel: mockBlogPostModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('List User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const createUser = () => ({
        id: faker.random.number(),
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      });

      const mockDataUser = new Array(10).fill(undefined).map(createUser);

      const mockBlogPost = jest.fn().mockReturnValue({
        list: async () =>
          new Promise((resolve, _reject) => {
            resolve(mockDataUser);
          }),
      });

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.list({ User: mockBlogPost, userModel: mockBlogPostModel });

      await act(null, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ userModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ users: mockDataUser });
    });
  });

  describe('Login User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataUserLogin = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockDataUser = {
        id: faker.random.number(),
        email: mockDataUserLogin.email,
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockDataToken = faker.random.hexaDecimal();

      const mockBlogPost = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUser, token: mockDataToken, error: null });
          }),
      });

      const mockReq = { body: mockDataUserLogin };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.login({ User: mockBlogPost, userModel: mockBlogPostModel });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ ...mockReq.body, userModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUser, token: mockDataToken });
    });

    it('on failure - user not found', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataUserLogin = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'exists' });
          }),
      });

      const mockReq = { body: mockDataUserLogin };

      const mockRes = jest.fn();

      const act = userController.login({ User: mockBlogPost, userModel: mockBlogPostModel });

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
        expect(mockBlogPost).toHaveBeenCalledTimes(1);

        expect(mockBlogPost).toHaveBeenCalledWith({
          ...mockReq.body,
          userModel: mockBlogPostModel,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });

    it('on failure - wrong password', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataUserLogin = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'wrongPassword' });
          }),
      });

      const mockReq = { body: mockDataUserLogin };

      const mockRes = jest.fn();

      const act = userController.login({ User: mockBlogPost, userModel: mockBlogPostModel });

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
        expect(mockBlogPost).toHaveBeenCalledTimes(1);

        expect(mockBlogPost).toHaveBeenCalledWith({
          ...mockReq.body,
          userModel: mockBlogPostModel,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Remove User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockBlogPost = jest.fn().mockReturnValue({
        remove: async () => new Promise((resolve, _reject) => resolve()),
      });

      const mockReq = { params: { id: mockId } };

      const mockEnd = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ end: mockEnd }) };

      const act = userController.remove({ User: mockBlogPost, userModel: mockBlogPostModel });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ userModel: mockBlogPostModel, id: mockId });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(204);

      expect(mockEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataUpdate = {
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockDataUser = {
        id: mockId,
        email: faker.internet.email(),
        displayName: mockDataUpdate.displayName,
        image: mockDataUpdate.image,
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        update: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataUser, error: null });
          }),
      });

      const mockReq = { params: { id: mockId }, body: mockDataUpdate };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = userController.update({ User: mockBlogPost, userModel: mockBlogPostModel });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({
        id: mockId,
        userModel: mockBlogPostModel,
        ...mockReq.body,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataUser });
    });

    it('on failure - wrong password', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataUpdate = {
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        update: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, error: 'notFound' });
          }),
      });

      const mockReq = { params: { id: mockId }, body: mockDataUpdate };

      const mockRes = jest.fn();

      const act = userController.update({ User: mockBlogPost, userModel: mockBlogPostModel });

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
        expect(mockBlogPost).toHaveBeenCalledTimes(1);

        expect(mockBlogPost).toHaveBeenCalledWith({
          id: mockId,
          userModel: mockBlogPostModel,
          ...mockReq.body,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });
});
