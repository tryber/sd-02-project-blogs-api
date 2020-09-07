const blogPostController = require('./blogPostController');

const faker = require('faker');

describe('Blog Post Controller', () => {
  describe('Create Blog Post', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataBlogPostSent = {
        title: faker.name.title(),
        content: faker.lorem.text(),
      };

      const mockUserId = faker.random.number();

      const mockReq = { body: mockDataBlogPostSent, user: { id: mockUserId } };

      const mockDataBlogPostReceived = {
        id: faker.random.number(),
        user_id: mockUserId,
        title: mockDataBlogPostSent.title,
        content: mockDataBlogPostSent.content,
        updatedAt: new Date(),
        createdAt: new Date(),
        published: new Date(),
        updated: new Date(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        create: async () =>
          new Promise((resolve, _reject) => {
            resolve(mockDataBlogPostReceived);
          }),
      });

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = blogPostController.create({
        BlogPost: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({
        ...mockReq.body,
        user_id: mockReq.user.id,
        blogPostModel: mockBlogPostModel,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(201);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({
        blogPost: mockDataBlogPostReceived,
      });
    });
  });

  describe('Find User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataBlogPostReceived = {
        id: mockId,
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        find: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataBlogPostReceived, error: null });
          }),
      });

      const mockReq = { params: { id: mockId } };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = blogPostController.find({ User: mockBlogPost, blogPostModel: mockBlogPostModel });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ id: mockId, blogPostModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataBlogPostReceived });
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

      const act = blogPostController.find({ User: mockBlogPost, blogPostModel: mockBlogPostModel });

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

        expect(mockBlogPost).toHaveBeenCalledWith({ id: mockId, blogPostModel: mockBlogPostModel });

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

      const mockDataBlogPostReceived = new Array(10).fill(undefined).map(createUser);

      const mockBlogPost = jest.fn().mockReturnValue({
        list: async () =>
          new Promise((resolve, _reject) => {
            resolve(mockDataBlogPostReceived);
          }),
      });

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = blogPostController.list({ User: mockBlogPost, blogPostModel: mockBlogPostModel });

      await act(null, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ blogPostModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ users: mockDataBlogPostReceived });
    });
  });

  describe('Login User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataBlogPostSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockDataBlogPostReceived = {
        id: faker.random.number(),
        email: mockDataBlogPostSent.email,
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockDataTokenReceived = faker.random.hexaDecimal();

      const mockBlogPost = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataBlogPostReceived, token: mockDataTokenReceived, error: null });
          }),
      });

      const mockReq = { body: mockDataBlogPostSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = blogPostController.login({
        User: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({
        ...mockReq.body,
        blogPostModel: mockBlogPostModel,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({
        user: mockDataBlogPostReceived,
        token: mockDataTokenReceived,
      });
    });

    it('on failure - user not found', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataBlogPostSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'exists' });
          }),
      });

      const mockReq = { body: mockDataBlogPostSent };

      const mockRes = jest.fn();

      const act = blogPostController.login({
        User: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

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
          blogPostModel: mockBlogPostModel,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });

    it('on failure - wrong password', async () => {
      const mockBlogPostModel = jest.fn();

      const mockDataBlogPostSent = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        login: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, token: null, error: 'wrongPassword' });
          }),
      });

      const mockReq = { body: mockDataBlogPostSent };

      const mockRes = jest.fn();

      const act = blogPostController.login({
        User: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

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
          blogPostModel: mockBlogPostModel,
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

      const act = blogPostController.remove({
        User: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ blogPostModel: mockBlogPostModel, id: mockId });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(204);

      expect(mockEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataBlogPostSent = {
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockDataBlogPostReceived = {
        id: mockId,
        email: faker.internet.email(),
        displayName: mockDataBlogPostSent.displayName,
        image: mockDataBlogPostSent.image,
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        update: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: mockDataBlogPostReceived, error: null });
          }),
      });

      const mockReq = { params: { id: mockId }, body: mockDataBlogPostSent };

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = blogPostController.update({
        User: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({
        id: mockId,
        blogPostModel: mockBlogPostModel,
        ...mockReq.body,
      });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ user: mockDataBlogPostReceived });
    });

    it('on failure - wrong password', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataBlogPostSent = {
        displayName: faker.name.findName(),
        image: faker.internet.url(),
      };

      const mockBlogPost = jest.fn().mockReturnValue({
        update: async () =>
          new Promise((resolve, _reject) => {
            resolve({ data: null, error: 'notFound' });
          }),
      });

      const mockReq = { params: { id: mockId }, body: mockDataBlogPostSent };

      const mockRes = jest.fn();

      const act = blogPostController.update({
        User: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

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
          blogPostModel: mockBlogPostModel,
          ...mockReq.body,
        });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });
});
