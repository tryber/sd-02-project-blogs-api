const blogPostRepository = require('./blogPostRepository');

const faker = require('faker');

describe('Blog Post Repository', () => {
  it('Create Blog Post', async () => {
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

    const mockCreate = jest.fn().mockResolvedValue(mockDataBlogPostReceived);

    const mockModels = {
      BlogPosts: {
        create: mockCreate,
      },
    };

    const repository = new blogPostRepository({ models: mockModels, data: mockDataBlogPostSent });

    const data = await repository.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(data).toStrictEqual(mockDataBlogPostReceived);
  });

  it('Find Blog Post', async () => {
    const mockDataBlogPostSent = {
      id: faker.random.number(),
    };

    const mockDataBlogPostReceived = {
      id: faker.random.number(),
      user_id: faker.random.number(),
      title: faker.name.title(),
      content: faker.lorem.text(),
      published: faker.date.past(),
      updated: faker.date.recent(),
    };

    const mockFindByPk = jest.fn().mockResolvedValue(mockDataBlogPostReceived);

    const mockModels = {
      BlogPosts: {
        findByPk: mockFindByPk,
      },
    };

    const repository = new blogPostRepository({ models: mockModels, data: mockDataBlogPostSent });

    const data = await repository.find();

    expect(mockFindByPk).toHaveBeenCalledTimes(1);

    expect(data).toStrictEqual(mockDataBlogPostReceived);
  });

  it('Find Blog Post By Name', async () => {
    const mockDataBlogPostReceived = {
      id: faker.random.number(),
      user_id: faker.random.number(),
      title: faker.name.title(),
      content: faker.lorem.text(),
      published: faker.date.past(),
      updated: faker.date.recent(),
    };

    const mockFindAll = jest.fn().mockResolvedValue(mockDataBlogPostReceived);

    const mockModels = {
      BlogPosts: {
        findAll: mockFindAll,
      },
    };

    const repository = new blogPostRepository({ models: mockModels, data: null });

    const data = await repository.findBy('email');

    expect(mockFindAll).toHaveBeenCalledTimes(1);

    expect(data).toStrictEqual(mockDataBlogPostReceived);
  });

  it('List Blog Post', async () => {
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

    const mockFindAll = jest.fn().mockResolvedValue(mockDataBlogPostsReceived);

    const mockModels = {
      BlogPosts: {
        findAll: mockFindAll,
      },
    };

    const repository = new blogPostRepository({ models: mockModels, data: null });

    const data = await repository.list();

    expect(mockFindAll).toHaveBeenCalledTimes(1);

    expect(data).toStrictEqual(mockDataBlogPostsReceived);
  });

  it('Remove User', async () => {
    const mockDataBlogPostSent = {
      id: faker.random.number(),
    };

    const mockDestroy = jest.fn();

    const mockModels = {
      BlogPosts: {
        destroy: mockDestroy,
      },
    };

    const repository = new blogPostRepository({ models: mockModels, data: mockDataBlogPostSent });

    await repository.remove();

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('Update User', async () => {
    const mockDataBlogPostSent = {
      id: faker.random.number(),
    };

    const mockUpdate = jest.fn();

    const mockModels = {
      BlogPosts: {
        update: mockUpdate,
      },
    };

    const repository = new blogPostRepository({ models: mockModels, data: mockDataBlogPostSent });

    await repository.update();

    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
});
