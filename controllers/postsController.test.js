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
  params: { id: 1 },
  headers: { authorization: 'token' },
  user: [{ id: 1 }],
};

const mockPosts = [
  {
    id: 2,
    content: 'The whole text for the blog post goes here in this key',
    title: 'Latest updates, August 1st',
    published: '2015-01-01T10:10:10.000Z',
    updated: '2015-01-01T10:10:10.000Z',
    user_id: 1,
    user: {
      id: 1,
      displayName: 'Brett Wiltshire',
      email: 'brett@email.com',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
    },
  },
  {
    id: 3,
    content: 'The whole text for the blog post goes here in this key',
    title: 'Latest updates, August 2st',
    published: '2020-08-15T23:47:55.000Z',
    updated: '2020-08-16T02:08:19.000Z',
    user_id: 2,
    user: {
      id: 2,
      displayName: 'Pedro Henrique',
      email: 'pedro@gmail.com',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/pedro.png',
    },
  },
];

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

  describe('update a post', () => {
    test('Missing fields', async () => {
      const mockReq = { body: {}, params: {} };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.updatePost(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith({ code: 'unauthorized', message: 'Missing fields' });
    });

    test('Try and catch error', async () => {
      const updatePostSpy = createSpyError(Post, 'update');

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.updatePost(mockRightReq, mockRes, mockNext);

      expect(updatePostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });

      updatePostSpy.mockRestore();
    });

    test('Update not succefull', async () => {
      const updatePostSpy = createSpy(Post, 'update', [false]);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.updatePost(mockRightReq, mockRes, mockNext);

      expect(updatePostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'access_denied', message: 'Not allowed' });

      updatePostSpy.mockRestore();
    });

    test('Update succefull', async () => {
      const updatePostSpy = createSpy(Post, 'update', [true]);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.updatePost(mockRightReq, mockRes, mockNext);

      expect(updatePostSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({ message: 'Post updated' });
      updatePostSpy.mockRestore();
    });
  });

  describe('Deleting a post', () => {
    test('Wrong post Id', async () => {
      const findPostSpy = createSpy(Post, 'findByPk', undefined);

      const mockReq = { params: { id: 1 }, user: [{ id: 2 }] };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.deletePost(mockReq, mockRes, mockNext);

      expect(findPostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'not_found', message: 'Post not found' });

      findPostSpy.mockRestore();
    });

    test('Not alloewd user', async () => {
      const findPostSpy = createSpy(Post, 'findByPk', { user_id: 1 });

      const mockReq = { params: { id: 1 }, user: [{ id: 2 }] };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.deletePost(mockReq, mockRes, mockNext);

      expect(findPostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'access_denied', message: 'User not allowed' });

      findPostSpy.mockRestore();
    });

    test('Try catch error', async () => {
      const findPostSpy = createSpyError(Post, 'findByPk', { user_id: 1 });

      const mockReq = { params: { id: 1 }, user: [{ id: 2 }] };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.deletePost(mockReq, mockRes, mockNext);

      expect(findPostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });

      findPostSpy.mockRestore();
    });

    test('Post deleted', async () => {
      const findPostSpy = createSpy(Post, 'findByPk', { user_id: 3 });
      const deletePostSpy = createSpy(Post, 'destroy');

      const mockReq = { params: { id: 1 }, user: [{ id: 3 }] };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.deletePost(mockReq, mockRes, mockNext);

      expect(findPostSpy).toBeCalledTimes(1);
      expect(deletePostSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({ message: 'Post deleted' });

      findPostSpy.mockRestore();
      deletePostSpy.mockRestore();
    });
  });

  describe('Getting all posts', () => {
    test('Try and catch error', async () => {
      const findAllPostSpy = createSpyError(Post, 'findAll');

      const mockReq = {};
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.getAllPosts(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });
      findAllPostSpy.mockRestore();
    });

    test('gett all posts correctly', async () => {
      const findAllPostSpy = createSpy(Post, 'findAll', mockPosts);

      const mockReq = {};
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.getAllPosts(mockReq, mockRes, mockNext);

      expect(findAllPostSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith(mockPosts);
      findAllPostSpy.mockRestore();
    });
  });

  describe('Find one post', () => {
    test('Try and catch error', async () => {
      const findPostSpy = createSpyError(Post, 'findByPk');

      const mockReq = { params: { id: 1 } };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.getPost(mockReq, mockRes, mockNext);

      expect(findPostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });
      findPostSpy.mockRestore();
    });

    test('No post found', async () => {
      const findPostSpy = createSpy(Post, 'findByPk', null);

      const mockReq = { params: { id: 1 } };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.getPost(mockReq, mockRes, mockNext);

      expect(findPostSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'not_found', message: 'Post not found' });
      findPostSpy.mockRestore();
    });

    test('Post found', async () => {
      const findPostSpy = createSpy(Post, 'findByPk', mockPosts[0]);

      const mockReq = { params: { id: 2 } };
      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await postsController.getPost(mockReq, mockRes, mockNext);

      expect(findPostSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith(mockPosts[0]);
      findPostSpy.mockRestore();
    });
  });
});
