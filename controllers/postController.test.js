const postController = require('./postController');
const { Post } = require('../models');

afterEach(() => jest.clearAllMocks());

describe('userController tests', () => {
  describe('Create Post', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const bodyData = { content: 'Blog post text here' };
      const userData = { id: 1, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null };
      const mockReq = { body: bodyData, user: userData };
      const joiAnswer = { code: 'bad_request', error: true, message: '"title" is required' };
      const mockJson = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      await postController.createPost(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(joiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid credentials, return response and status 201', async () => {
      const bodyData = { title: 'Updates, August 14th', content: 'Blog post' };
      const userData = { id: 1, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null };
      const mockReq = { body: bodyData, user: userData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const dbAnswer = { content: 'Blog post', title: 'Updates, August 14th', userId: 1 };
      const createPostSpy = jest.spyOn(Post, 'create').mockReturnValueOnce(dbAnswer);
      await postController.createPost(mockReq, mockRes, mockNext);

      expect(createPostSpy).toBeCalledTimes(1);
      expect(createPostSpy).toBeCalledWith(dbAnswer);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson).toBeCalledWith(dbAnswer);
    });
  });

  describe('Get All posts', () => {
    test('Return all posts from database and status 200', async () => {
      const mockResponse = [
        {
          id: 1,
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.000Z',
          user: { id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', image: null },
        },
        {
          id: 2,
          title: 'Latest updates, August 15th',
          content: 'Blog post text here',
          published: '2020-08-15T05:36:59.000Z',
          updated: '2020-08-15T05:36:59.000Z',
          user: { id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', image: null },
        },
        {
          id: 3,
          title: 'More updates, August 15th',
          content: 'Blog post text here',
          published: '2020-08-15T05:45:51.000Z',
          updated: '2020-08-15T05:45:51.000Z',
          user: { id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', image: null },
        },
      ];
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const getAllPostsSpy = jest.spyOn(Post, 'findAll').mockReturnValueOnce(mockResponse);

      await postController.getAllPosts(null, mockRes);

      expect(getAllPostsSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockResponse);
    });
  });

  describe('Update Post By Id', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const bodyData = { title: 'Latest updates, August 14th' };
      const userData = { id: 1, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null };
      const mockReq = { body: bodyData, user: userData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const joiAnswer = { code: 'bad_request', error: true, message: '"content" is required' };

      await postController.updatePostById(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(joiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid info but author is not valid, return message and status 403', async () => {
      const bodyData = { title: 'Latest updates, August 14th', content: 'Blog post text here' };
      const userData = { id: 1, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null };
      const mockReq = { body: bodyData, user: userData, params: { id: 4 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const updatePostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce(null);
      const serviceAnswer = { error: true, message: 'Usuário não autorizado', code: 'unauthorized' };

      await postController.updatePostById(mockReq, mockRes, mockNext);

      expect(updatePostByIdSpy).toBeCalledTimes(1);
      expect(updatePostByIdSpy).toBeCalledWith({ where: { id: 4, userId: 1 } });
      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid credentials, return response and status 201', async () => {
      const bodyData = { title: 'Latest updates', content: 'Blog post' };
      const userData = { id: 1, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null };
      const mockReq = { body: bodyData, user: userData, params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const dbAnswer = { content: 'Blog post', title: 'Latest updates', userId: 1 };
      const mockUpdateSequelize = { content: 'Blog post', title: 'Latest updates' };
      const findPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce(dbAnswer);
      const updatePostByIdSpy = jest.spyOn(Post, 'update').mockReturnValueOnce(mockUpdateSequelize);

      await postController.updatePostById(mockReq, mockRes, mockNext);

      expect(findPostByIdSpy).toBeCalledTimes(1);
      expect(findPostByIdSpy).toBeCalledWith({ where: { id: 2, userId: 1 } });
      expect(updatePostByIdSpy).toBeCalledTimes(1);
      expect(updatePostByIdSpy).toBeCalledWith(mockUpdateSequelize, { where: { id: 2 } });
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(dbAnswer);
    });
  });

  describe('Get Post By Id', () => {
    test('If service does not find any info, return a message', async () => {
      const mockReq = { params: { id: 100 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const serviceAnswer = { error: true, message: 'Post não existe', code: 'not_found' };
      const getPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce(null);

      await postController.getPostById(mockReq, mockRes, mockNext);

      expect(getPostByIdSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If req.params.id is a valid post, return post info and status 200', async () => {
      const mockReq = { params: { id: 3 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const postData = {
        id: 3,
        title: '16 de Agosto',
        content: 'GET TEST #001',
        published: '2020-08-16T20:14:42.000Z',
        updated: '2020-08-16T21:11:08.000Z',
        user: { id: 2, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null },
      };
      const getPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce({ dataValues: postData });

      await postController.getPostById(mockReq, mockRes, mockNext);

      expect(getPostByIdSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith({ dataValues: postData });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Get Post By Query', () => {
    test('If service does not find any info, return a message', async () => {
      const mockReq = { query: { q: 'something_that_could_not_be_found_in_the_database' } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const serviceAnswer = [];
      const getPostByQuerySpy = jest.spyOn(Post, 'findAll').mockReturnValueOnce(null);

      await postController.getPostByQuery(mockReq, mockRes, mockNext);

      expect(getPostByQuerySpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(serviceAnswer);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('If req.params.id is a valid post, return post info and status 200', async () => {
      const mockReq = { query: { q: 'test' } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const postData = [
        {
          id: 1,
          title: 'Latest updates',
          content: 'blog text',
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.000Z',
          user: { id: 2, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null },
        },
        {
          id: 2,
          title: 'Último update, 16 de Agosto em PT-BR',
          content: 'PUT TEST #002',
          published: '2020-08-16T20:14:42.000Z',
          updated: '2020-08-16T21:11:08.000Z',
          user: { id: 2, displayName: 'Johnatas', email: 'johnny@gmail.com', image: null },
        },
      ];
      const getPostByQuerySpy = jest.spyOn(Post, 'findAll').mockReturnValueOnce({ dataValues: postData });

      await postController.getPostByQuery(mockReq, mockRes, mockNext);

      expect(getPostByQuerySpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith({ dataValues: postData });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Delete User By Id', () => {
    test('If post was not found, return a message and status 404', async () => {
      const mockReq = { user: { id: 2 }, params: { id: 300 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const serviceAnswer = { error: true, message: 'Post não existe', code: 'not_found' };
      const getPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce(null);

      await postController.deletePostById(mockReq, mockRes, mockNext);

      expect(getPostByIdSpy).toBeCalledTimes(1);
      expect(getPostByIdSpy).toBeCalledWith({ where: { id: 300 } });
      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If user is not the author, return a message and status 403', async () => {
      const mockReq = { user: { id: 3 }, params: { id: 3 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const postData = {
        id: 3,
        title: 'Último update, 16 de Agosto em PT-BR',
        content: 'PUT TEST #001',
        published: '2020-08-16T20:14:42.000Z',
        updated: '2020-08-16T21:11:08.000Z',
        userId: 2,
      };
      const serviceAnswer = { error: true, message: 'Usuário não autorizado', code: 'unauthorized' };
      const getPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce({ dataValues: postData });

      await postController.deletePostById(mockReq, mockRes, mockNext);

      expect(getPostByIdSpy).toBeCalledTimes(1);
      expect(getPostByIdSpy).toBeCalledWith({ where: { id: 3 } });
      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('When deleting, return an end and status 204', async () => {
      const mockReq = { user: { id: 2 }, params: { id: 3 } };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const postData = {
        id: 3,
        title: 'Último update, 16 de Agosto em PT-BR',
        content: 'PUT TEST #001',
        published: '2020-08-16T20:14:42.000Z',
        updated: '2020-08-16T21:11:08.000Z',
        userId: 2,
      };
      const getPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce({ dataValues: postData });
      const deletePostByIdSpy = jest.spyOn(Post, 'destroy').mockReturnValueOnce();

      await postController.deletePostById(mockReq, mockRes, mockNext);

      expect(getPostByIdSpy).toBeCalledTimes(1);
      expect(getPostByIdSpy).toBeCalledWith({ where: { id: 3 } });
      expect(deletePostByIdSpy).toBeCalledTimes(1);
      expect(deletePostByIdSpy).toBeCalledWith({ where: { id: 3 } });
      expect(mockRes.status).toBeCalledWith(204);
      expect(mockEnd).toBeCalled();
    });
  });
});
