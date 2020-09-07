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
        published: faker.date.past(),
        updated: faker.date.recent(),
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

  describe('Find Blog Post', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockUserId = faker.random.number();

      const mockDataBlogPostReceived = {
        id: mockId,
        user_id: mockUserId,
        title: faker.name.title(),
        content: faker.lorem.text(),
        user: {
          id: mockUserId,
          email: faker.internet.email(),
          displayName: faker.name.findName(),
          image: faker.internet.url(),
        },
        published: faker.date.past(),
        updated: faker.date.recent(),
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

      const act = blogPostController.find({
        BlogPost: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

      await act(mockReq, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ id: mockId, blogPostModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ blogPost: mockDataBlogPostReceived });
    });

    it('on failure - post not found', async () => {
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

      const act = blogPostController.find({
        BlogPost: mockBlogPost,
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

        expect(message).toBe('Post não encontrado');
      } finally {
        expect(mockBlogPost).toHaveBeenCalledTimes(1);

        expect(mockBlogPost).toHaveBeenCalledWith({ id: mockId, blogPostModel: mockBlogPostModel });

        expect(mockRes).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('List Blog Post', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const createBlogPost = () => ({
        id: faker.random.number(),
        title: faker.name.title(),
        content: faker.lorem.text(),
        user: {
          id: faker.random.number(),
          email: faker.internet.email(),
          displayName: faker.name.findName(),
          image: faker.internet.url(),
        },
        published: faker.date.past(),
        updated: faker.date.recent(),
      });

      const mockDataBlogPostReceived = new Array(10).fill(undefined).map(createBlogPost);

      const mockBlogPost = jest.fn().mockReturnValue({
        list: async () =>
          new Promise((resolve, _reject) => {
            resolve(mockDataBlogPostReceived);
          }),
      });

      const mockJson = jest.fn();

      const mockRes = { status: jest.fn().mockReturnValue({ json: mockJson }) };

      const act = blogPostController.list({
        BlogPost: mockBlogPost,
        blogPostModel: mockBlogPostModel,
      });

      await act(null, mockRes);

      expect(mockBlogPost).toHaveBeenCalledTimes(1);

      expect(mockBlogPost).toHaveBeenCalledWith({ blogPostModel: mockBlogPostModel });

      expect(mockRes.status).toHaveBeenCalledTimes(1);

      expect(mockRes.status).toHaveBeenCalledWith(200);

      expect(mockJson).toHaveBeenCalledTimes(1);

      expect(mockJson).toHaveBeenCalledWith({ blogPosts: mockDataBlogPostReceived });
    });
  });

  describe('Remove Blog Post', () => {
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
        BlogPost: mockBlogPost,
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

  describe('Search Blog Post', () => {
    it('on success', async () => {});

    it('on failure - post not found', async () => {});
  });

  describe('Update User', () => {
    it('on success', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataBlogPostSent = {
        title: faker.name.title(),
        content: faker.lorem.text(),
      };

      const mockDataBlogPostReceived = {
        id: mockId,
        title: mockDataBlogPostSent.title,
        content: mockDataBlogPostSent.content,
        user: {
          id: faker.random.number(),
          email: faker.internet.email(),
          displayName: faker.name.findName(),
          image: faker.internet.url(),
        },
        published: faker.date.past(),
        updated: faker.date.recent(),
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
        BlogPost: mockBlogPost,
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

      expect(mockJson).toHaveBeenCalledWith({ blogPost: mockDataBlogPostReceived });
    });

    it('on failure - post not found', async () => {
      const mockBlogPostModel = jest.fn();

      const mockId = faker.random.number();

      const mockDataBlogPostSent = {
        title: faker.name.title(),
        content: faker.lorem.text(),
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
        BlogPost: mockBlogPost,
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

        expect(message).toBe('Post não encontrado');
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
