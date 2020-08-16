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
            id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', password: '123456', image: null,
          },
        },
        {
          id: 2,
          title: 'Latest updates, August 15th',
          content: 'Blog post text here',
          published: '2020-08-15T05:36:59.000Z',
          updated: '2020-08-15T05:36:59.000Z',
          user: {
            id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', password: '123456', image: null,
          },
        },
        {
          id: 3,
          title: 'Latest updates, August 14th',
          content: 'Blog post text here',
          published: '2020-08-15T05:45:51.000Z',
          updated: '2020-08-15T05:45:51.000Z',
          user: {
            id: 1, displayName: 'Brett Wiltshire', email: 'brett@email.com', password: '123456', image: null,
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

  describe.skip('Get User By Id', () => {
    test('If service does not find any info, return a message', async () => {
      const mockReq = { params: { id: 100 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const serviceAnswer = { code: 'not_found', error: true, message: 'Usuário não existe' };
      const getUserByIdSpy = jest.spyOn(User, 'findByPk').mockReturnValueOnce(null);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(serviceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();

      getUserByIdSpy.mockRestore();
    });

    test('If req.params.id is a valid user, return user info and status 200', async () => {
      const mockReq = { params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const userData = {
        id: 2, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
      };
      const mockSequelize = { dataValues: userData };
      const getUserByIdSpy = jest.spyOn(User, 'findByPk').mockReturnValueOnce(mockSequelize);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(getUserByIdSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockSequelize);
      expect(mockNext).not.toHaveBeenCalled();

      getUserByIdSpy.mockRestore();
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
