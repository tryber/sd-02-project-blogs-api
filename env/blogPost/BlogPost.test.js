const blogPostService = require('./blogPostService');

const BlogPost = require('./BlogPost');

const faker = require('faker');

describe('BlogPost', () => {
  it('Create', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockCreate = jest.spyOn(blogPostService, 'create').mockReturnValue(mockDataReceived);

    const blogPost = new BlogPost({ blogPostModel: mockModel, id: mockId, ...mockDataSent });

    const data = await blogPost.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(mockCreate).toHaveBeenCalledWith({ Model: mockModel, data: mockDataSent });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Find', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockFind = jest.spyOn(blogPostService, 'find').mockReturnValue(mockDataReceived);

    const blogPost = new BlogPost({ blogPostModel: mockModel, id: mockId, ...mockDataSent });

    const data = await blogPost.find();

    expect(mockFind).toHaveBeenCalledTimes(1);

    expect(mockFind).toHaveBeenCalledWith({ Model: mockModel, id: mockId });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('List', async () => {
    const mockDataSent = { a: 0 };

    const mockDataReceived = { b: 1 };

    const mockModel = jest.fn();

    const mockList = jest.spyOn(blogPostService, 'list').mockReturnValue(mockDataReceived);

    const blogPost = new BlogPost({ blogPostModel: mockModel, ...mockDataSent });

    const data = await blogPost.list();

    expect(mockList).toHaveBeenCalledTimes(1);

    expect(mockList).toHaveBeenCalledWith({ Model: mockModel });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Remove', async () => {
    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockRemove = jest.spyOn(blogPostService, 'remove').mockImplementation(jest.fn());

    const blogPost = new BlogPost({ blogPostModel: mockModel, id: mockId });

    await blogPost.remove();

    expect(mockRemove).toHaveBeenCalledTimes(1);

    expect(mockRemove).toHaveBeenCalledWith({ Model: mockModel, id: mockId });
  });

  it('Search', async () => {
    const mockDataReceived = { b: 1 };

    const mockName = faker.lorem.word();

    const mockModel = jest.fn();

    const mockSearch = jest.spyOn(blogPostService, 'search').mockReturnValue(mockDataReceived);

    const blogPost = new BlogPost({ blogPostModel: mockModel });

    const data = await blogPost.search(mockName);

    expect(mockSearch).toHaveBeenCalledTimes(1);

    expect(mockSearch).toHaveBeenCalledWith({ Model: mockModel, name: mockName });

    expect(data).toStrictEqual(mockDataReceived);
  });

  it('Update', async () => {
    const mockDataSent = { email: faker.internet.email(), password: faker.internet.password() };

    const mockId = faker.random.number();

    const mockModel = jest.fn();

    const mockUpdate = jest.spyOn(blogPostService, 'update').mockImplementation(jest.fn());

    const blogPost = new BlogPost({ blogPostModel: mockModel, id: mockId, ...mockDataSent });

    await blogPost.update();

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    expect(mockUpdate).toHaveBeenCalledWith({ Model: mockModel, id: mockId, data: mockDataSent });
  });
});
