const userController = require('./userController');
const postController = require('./postController');
const { User, Post } = require('../models');

describe('userController tests', () => {
  describe('Create Post', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = { content: 'Blog post text here' };
      const userData = {
        id: 1, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
      };
      const mockReq = { body: mockBodyData, user: userData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoiAnswer = {
        code: 'bad_request', error: true, message: '"title" is required',
      };
      const mockSequelize = { dataValues: userData, ...userData };
      const createPostSpy = jest.spyOn(Post, 'create').mockReturnValueOnce(mockSequelize);

      await postController.createPost(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      createPostSpy.mockRestore();
    });

    test('If pass valid credentials, return response and status 201', async () => {
      const mockBodyData = { title: 'Latest updates, August 14th', content: 'Blog post text here' };
      const userData = {
        id: 1, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
      };
      const mockReq = { body: mockBodyData, user: userData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockSequelize = { content: 'Blog post text here', title: 'Latest updates, August 14th', userId: 1 };
      const createPostSpy = jest.spyOn(Post, 'create').mockReturnValueOnce(mockSequelize);
      await postController.createPost(mockReq, mockRes, mockNext);

      expect(createPostSpy).toBeCalledTimes(1);
      expect(createPostSpy).toBeCalledWith(mockSequelize);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson).toBeCalledWith(mockSequelize);

      createPostSpy.mockRestore();
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
          user: {
            id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', image: null,
          },
        },
        {
          id: 2,
          title: 'Latest updates, August 15th',
          content: 'Blog post text here',
          published: '2020-08-15T05:36:59.000Z',
          updated: '2020-08-15T05:36:59.000Z',
          user: {
            id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', image: null,
          },
        },
        {
          id: 3,
          title: 'Latest updates, August 14th',
          content: 'Blog post text here',
          published: '2020-08-15T05:45:51.000Z',
          updated: '2020-08-15T05:45:51.000Z',
          user: {
            id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', image: null,
          },
        },
      ];
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const getAllPostsSpy = jest.spyOn(Post, 'findAll').mockReturnValueOnce(mockResponse);

      await postController.getAllPosts(null, mockRes);

      expect(getAllPostsSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockResponse);

      getAllPostsSpy.mockRestore();
    });
  });

  describe('Update Post By Id', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = { content: 'Blog post text here' };
      const userData = {
        id: 1, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
      };
      const mockReq = { body: mockBodyData, user: userData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoiAnswer = { code: 'bad_request', error: true, message: '"title" is required' };

      await postController.updatePostById(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid info but is not author, return message and status 403', async () => {
      const mockBodyData = { title: 'Latest updates, August 14th', content: 'Blog post text here' };
      const userData = {
        id: 1, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
      };
      const mockReq = { body: mockBodyData, user: userData, params: { id: 4 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockSequelize = null;
      const updatePostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce(mockSequelize);
      const mockServiceAnswer = { error: true, message: 'Usuário não autorizado', code: 'unauthorized' };

      await postController.updatePostById(mockReq, mockRes, mockNext);

      expect(updatePostByIdSpy).toBeCalledTimes(1);
      expect(updatePostByIdSpy).toBeCalledWith({ where: { id: 4, userId: 1 } });
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      updatePostByIdSpy.mockRestore();
    });

    test('If pass valid credentials, return response and status 201', async () => {
      const mockBodyData = { title: 'Latest updates', content: 'Blog post' };
      const userData = {
        id: 1, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
      };
      const mockReq = { body: mockBodyData, user: userData, params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockSequelize = { content: 'Blog post', title: 'Latest updates', userId: 1 };
      const mockUpdateSequelize = { content: 'Blog post', title: 'Latest updates' };
      const findPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce(mockSequelize);
      const updatePostByIdSpy = jest.spyOn(Post, 'update').mockReturnValueOnce(mockUpdateSequelize);

      await postController.updatePostById(mockReq, mockRes, mockNext);

      expect(findPostByIdSpy).toBeCalledTimes(1);
      expect(findPostByIdSpy).toBeCalledWith({ where: { id: 2, userId: 1 } });
      expect(updatePostByIdSpy).toBeCalledTimes(1);
      expect(updatePostByIdSpy).toBeCalledWith(mockUpdateSequelize, { where: { id: 2 } });
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockSequelize);

      findPostByIdSpy.mockRestore();
      updatePostByIdSpy.mockRestore();
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

      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      getPostByIdSpy.mockRestore();
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
        user: {
          id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
        },
      };
      const mockSequelize = { dataValues: postData };
      const getPostByIdSpy = jest.spyOn(Post, 'findOne').mockReturnValueOnce(mockSequelize);

      await postController.getPostById(mockReq, mockRes, mockNext);

      expect(getPostByIdSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockSequelize);
      expect(mockNext).not.toHaveBeenCalled();

      getPostByIdSpy.mockRestore();
    });
  });

  describe('Get Post By Query', () => {
    test('If service does not find any info, return a message', async () => {
      const mockReq = { query: { q: 'something_that_could_not_be_found_in_the_database' } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const serviceAnswer = { error: true, message: 'Nenhum post foi encontrado', code: 'not_found' };
      const getPostByQuery = jest.spyOn(Post, 'findAll').mockReturnValueOnce(null);

      await postController.getPostByQuery(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      getPostByQuery.mockRestore();
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
          user: {
            id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
          },
        },
        {
          id: 1,
          title: 'Último update, 16 de Agosto em PT-BR',
          content: 'PUT TEST #002',
          published: '2020-08-16T20:14:42.000Z',
          updated: '2020-08-16T21:11:08.000Z',
          user: {
            id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
          },
        },
      ];
      const mockSequelize = { dataValues: postData };
      const getPostByQuerySpy = jest.spyOn(Post, 'findAll').mockReturnValueOnce(mockSequelize);

      await postController.getPostByQuery(mockReq, mockRes, mockNext);

      expect(getPostByQuerySpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockSequelize);
      expect(mockNext).not.toHaveBeenCalled();

      getPostByQuerySpy.mockRestore();
    });
  });

  describe.skip('Delete User By Id', () => {
    test('When deleting, return an end and status 204', async () => {
      const mockReq = { user: { id: 1 } };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const deleteUserByIdSpy = jest.spyOn(User, 'destroy').mockReturnValueOnce();

      await userController.deleteUserById(mockReq, mockRes, mockNext);

      expect(deleteUserByIdSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(204);
      expect(mockEnd).toBeCalled();

      deleteUserByIdSpy.mockRestore();
    });
  });
});
