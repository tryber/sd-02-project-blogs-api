const blogPostMapper = require('./blogPostMapper');

const blogPostRepository = require('./blogPostRepository');

const models = require('../../database/models');

jest.mock('./blogPostRepository');

test('User Mapper', () => {
  const mockData = { a: 0 };

  const mockRepository = jest.fn();

  blogPostRepository.mockImplementation(mockRepository);

  const repository = blogPostMapper(mockData);

  expect(blogPostRepository).toHaveBeenCalledTimes(1);

  expect(blogPostRepository).toHaveBeenCalledWith({ models, data: mockData });

  expect(repository).toStrictEqual;
});
