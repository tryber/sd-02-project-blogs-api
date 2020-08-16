const { Post } = require('../models');
const postsController = require('./postsController');

const createSpy = (func, method, value) => jest
  .spyOn(func, method)
  .mockReturnValueOnce(value);

const createSpyError = (func, method) => jest
  .spyOn(func, method)
  .mockImplementation(() => {
    throw new Error();
  });

const body = {
  title: 'title',
  content: 'The whole text for the blog post goes here in this key',
};

const mockRightReq = {
  body,
  headers: { authorization: 'token' },
  user: [{ id: 1 }],
};

describe('Post Controller test', () => {
  describe('Post a post', () => {
    test('Missing fields', async () => {
      const mockReq = { body: {}, headers: {} };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.postPost(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith({ code: 'unauthorized', message: 'Missing fields' });
    });

    test('Post created', async () => {
      const createPostSpy = createSpy(Post, 'create');

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.postPost(mockRightReq, mockRes, mockNext);

      expect(createPostSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({ message: 'Post created' });

      createPostSpy.mockRestore();
    });

    test('Try and catch error', async () => {
      const createPostSpy = createSpyError(Post, 'create');

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.postPost(mockRightReq, mockRes, mockNext);

      expect(createPostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });

      createPostSpy.mockRestore();
    });
  });
});
