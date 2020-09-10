const blogPostService = require('./blogPostService');

const faker = require('faker');

const utils = require('../../utils');

describe('BlogPost Service', () => {
  describe('Create BlogPost', () => {
    it('on success', async () => {
      const mockDataBlogPostSent = {
        title: faker.name.title(),
        content: faker.lorem.text(),
      };

      const mockDataBlogPostReceived = {
        id: faker.random.number(),
        user_id: faker.random.number(),
        title: mockDataBlogPostSent.title,
        content: mockDataBlogPostSent.content,
        published: faker.date.past(),
        updated: faker.date.recent(),
      };

      const mockModel = jest.fn().mockReturnValue({
        create: jest.fn().mockResolvedValue(mockDataBlogPostReceived),
      });

      const data = await blogPostService.create({ data: mockDataBlogPostSent, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith(mockDataBlogPostSent);

      expect(data).toStrictEqual(mockDataBlogPostReceived);
    });
  });

  describe('Find BlogPost', () => {
    it('on success', async () => {
      const mockId = faker.random.number();

      const mockDataBlogPostReceived = {
        id: faker.random.number(),
        user_id: faker.random.number(),
        title: faker.name.title(),
        content: faker.lorem.text(),
        published: faker.date.past(),
        updated: faker.date.recent(),
      };

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue(mockDataBlogPostReceived),
      });

      const data = await blogPostService.find({ id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ id: mockId });

      expect(data).toStrictEqual({ data: mockDataBlogPostReceived, error: null });
    });

    it('on failure - BlogPost not found', async () => {
      const mockId = faker.random.number();

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue(null),
      });

      const data = await blogPostService.find({ id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ id: mockId });

      expect(data).toStrictEqual({ data: null, error: 'notFound' });
    });
  });

  describe('List BlogPost', () => {
    it('on success', async () => {
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

      const mockDataBlogPostsReceived = new Array(10).fill(undefined).map(createBlogPost);

      const mockModel = jest.fn().mockReturnValue({
        list: jest.fn().mockResolvedValue(mockDataBlogPostsReceived),
      });

      const data = await blogPostService.list({ Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual(mockDataBlogPostsReceived);
    });
  });

  describe('Remove BlogPost', () => {
    it('on success', async () => {
      const mockId = faker.random.number();

      const mockRemove = jest.fn();

      const mockModel = jest.fn().mockReturnValue({
        remove: mockRemove,
      });

      await blogPostService.remove({ id: mockId, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ id: mockId });

      expect(mockRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Search BlogPost', () => {
    it('on success', async () => {
      const mockName = faker.lorem.word();

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

      const mockDataBlogPostReceived = new Array(5).fill(undefined).map(createBlogPost);

      const mockFindBy = jest.fn().mockResolvedValue(mockDataBlogPostReceived);

      const mockModel = jest.fn().mockReturnValue({
        findBy: mockFindBy,
      });

      const data = await blogPostService.search({ name: mockName, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockFindBy).toHaveBeenCalledWith(mockName);

      expect(data).toStrictEqual({ data: mockDataBlogPostReceived, error: null });
    });

    it('on failure - post not found', async () => {
      const mockName = faker.lorem.word();

      const mockFindBy = jest.fn().mockResolvedValue([]);

      const mockModel = jest.fn().mockReturnValue({
        findBy: mockFindBy,
      });

      const data = await blogPostService.search({ name: mockName, Model: mockModel });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockFindBy).toHaveBeenCalledWith(mockName);

      expect(data).toStrictEqual({ data: null, error: 'notFound' });
    });
  });

  describe('Update BlogPost', () => {
    it('on success', async () => {
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

      const mockUpdate = jest.fn().mockResolvedValue();

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(mockDataBlogPostReceived),
        update: mockUpdate,
      });

      const data = await blogPostService.update({
        data: mockDataBlogPostSent,
        id: mockId,
        Model: mockModel,
      });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ id: mockId, ...mockDataBlogPostSent });

      expect(mockUpdate).toHaveBeenCalledTimes(1);

      expect(data).toStrictEqual({
        data: mockDataBlogPostReceived,
        error: null,
      });
    });

    it('on failure - BlogPost not found', async () => {
      const mockId = faker.random.number();

      const mockDataBlogPostSent = {
        displayName: faker.name.findName(),
      };

      const mockUpdate = jest.fn().mockResolvedValue();

      const mockModel = jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValueOnce(false),
        update: mockUpdate,
      });

      const data = await blogPostService.update({
        data: mockDataBlogPostSent,
        id: mockId,
        Model: mockModel,
      });

      expect(mockModel).toHaveBeenCalledTimes(1);

      expect(mockModel).toHaveBeenCalledWith({ id: mockId, ...mockDataBlogPostSent });

      expect(mockUpdate).toHaveBeenCalledTimes(0);

      expect(data).toStrictEqual({
        data: null,
        error: 'notFound',
      });
    });
  });
});
