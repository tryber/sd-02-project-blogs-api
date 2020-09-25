const blogPostsService = require('../services/blogPostsService');
const blogPostsController = require('./blogPostsController');
const { Users, BlogPosts } = require('../models');

describe('blog post controller, service tests', () => {
  describe('testando endpoing post /post', () => {
    it('if Post was created and returning success with status code 200 and token', async () => {
      const mockBody = {
        title: 'As loucuras da mAyJaeasd', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockData = {
        id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockResponse = {
        dataValues: mockData,
      };

      jest.spyOn(Users, 'findOne').mockReturnValueOnce(mockResponse);
      jest.spyOn(BlogPosts, 'create');

      await blogPostsController.createBlogPost(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockEnd).toHaveBeenCalledTimes(1);
      expect(Users.findOne).toHaveBeenCalledTimes(1);
      expect(BlogPosts.create).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    it('if credentials was wrong and returning error with status code 400', async () => {
      const mockBody = {
        title: '', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Campos inválidos', code: 'bad_request' };

      jest.restoreAllMocks();

      jest.spyOn(blogPostsService, 'createBlogPost');

      await blogPostsController.createBlogPost(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(blogPostsService.createBlogPost).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if database return an error with status code 500', async () => {
      const mockBody = {
        title: 'As loucuras da mAyJaeasd', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOne').mockImplementationOnce(() => { throw new Error(mockError); });
      await blogPostsController.createBlogPost(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
  describe('testando endpoint get /post', () => {
    it('if returning success with status code 200 and all posts', async () => {
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockData = [
        {
          id: '1',
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.947Z',
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
          user: {
            id: '1',
            displayName: 'Julio Cezar',
            email: 'jctaraujo@hotmail.com',
            image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
          },
        },
      ];
      const mockResponse = [{
        dataValues: mockData,
      }];

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'findAll').mockReturnValueOnce(mockResponse);

      await blogPostsController.getAllPosts(null, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(BlogPosts.findAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockJson.mock.calls[0][0]).toBe(mockResponse);
    });
    it('if database return an error with status code 500', async () => {
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'findAll').mockImplementationOnce(() => { throw new Error(mockError); });
      await blogPostsController.getAllPosts(null, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
  describe('testando endpoint put /post/:id', () => {
    it('if update was a success and return status 200', async () => {
      const mockParams = { id: 1 };
      const mockBody = {
        title: 'As loucuras da mAyJaeasd', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockData = [
        {
          id: '1',
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.947Z',
          title: 'As loucuras da mAyJaeasd',
          content: 'O filme fala das loucuras da daewwe1',
          user: {
            id: '1',
            displayName: 'Julio Cezar',
            email: 'jctaraujo@hotmail.com',
            image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
          },
        },
      ];
      const mockResponse = {
        dataValues: mockData,
      };
      const mockDataUser = {
        id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOne').mockReturnValueOnce(mockDataUser);
      jest.spyOn(blogPostsService, 'updateById').mockReturnValueOnce(mockResponse);

      await blogPostsController.updateById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(Users.findOne).toHaveBeenCalledTimes(1);
      expect(blogPostsService.updateById).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockEnd).toHaveBeenCalled();
    });
    it('if credentials was wrong and returning error with status code 401', async () => {
      const mockParams = { id: 1 };
      const mockBody = {
        title: '', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Campos inválidos', code: 'bad_request' };

      jest.restoreAllMocks();

      jest.spyOn(blogPostsService, 'validateUser');
      await blogPostsController.updateById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(blogPostsService.validateUser).not.toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if user email is different from post data and return error with status 403', async () => {
      const mockParams = { id: 1 };
      const mockBody = {
        title: 'adasdaweqdasdqweasdq', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctarau@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockDataUser = {
        id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockError = { error: 'Operação não permitida', code: 'access_denied' };

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOne').mockReturnValueOnce(mockDataUser);

      await blogPostsController.updateById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(Users.findOne).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if database user return an error with status code 500', async () => {
      const mockParams = { id: 1 };
      const mockBody = {
        title: 'adasdaweqdasdqweasdq', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctarau@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOne').mockImplementationOnce(() => { throw new Error(mockError); });
      await blogPostsController.updateById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if update return error', async () => {
      const mockParams = { id: 1 };
      const mockBody = {
        title: 'adasdaweqdasdqweasdq', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockDataUser = {
        id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };

      jest.restoreAllMocks();

      jest.spyOn(Users, 'findOne').mockReturnValueOnce(mockDataUser);
      jest.spyOn(BlogPosts, 'findByPk').mockReturnValueOnce(mockDataUser);

      await blogPostsController.updateById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if database post return an error with status code 500', async () => {
      const mockParams = { id: 1 };
      const mockBody = {
        title: 'adasdaweqdasdqweasdq', content: 'O filme fala das loucuras da daewwe1',
      };
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockReq = { body: mockBody, user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'findByPk').mockImplementationOnce(() => { throw new Error(mockError); });
      await blogPostsController.updateById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
  describe('testando endpoint get /post/:id', () => {
    it('if returnin success with user and status 200', async () => {
      const mockParams = { id: 1 };
      const mockReq = { params: mockParams };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockData = [
        {
          id: '1',
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.947Z',
          title: 'As loucuras da mAyJaeasd',
          content: 'O filme fala das loucuras da daewwe1',
          user: {
            id: '1',
            displayName: 'Julio Cezar',
            email: 'jctaraujo@hotmail.com',
            image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
          },
        },
      ];
      const mockResponse = {
        dataValues: mockData,
      };

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'findByPk').mockReturnValueOnce(mockResponse);

      await blogPostsController.getPostById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(BlogPosts.findByPk).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockJson.mock.calls[0][0]).toBe(mockResponse);
    });
    it('if database return an error with status code 500', async () => {
      const mockParams = { id: 1 };
      const mockReq = { params: mockParams };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'findByPk').mockImplementationOnce(() => { throw new Error(mockError); });
      await blogPostsController.getPostById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if post return null', async () => {
      const mockParams = { id: 1 };
      const mockReq = { params: mockParams };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Post não encontrado', code: 'not_found' };

      jest.restoreAllMocks();

      jest.spyOn(blogPostsService, 'getPostsById').mockReturnValueOnce(null);
      await blogPostsController.getPostById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
  describe('testando endpoint get /post/search', () => {
    it('if returning success with user and status 200', async () => {
      const mockQuery = { q: 'As loucuras' };
      const mockReq = { query: mockQuery };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockData = [
        {
          id: '1',
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.947Z',
          title: 'As loucuras da mAyJaeasd',
          content: 'O filme fala das loucuras da daewwe1',
          user: {
            id: '1',
            displayName: 'Julio Cezar',
            email: 'jctaraujo@hotmail.com',
            image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
          },
        },
      ];
      const mockResponse = {
        dataValues: mockData,
      };

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'findAll').mockReturnValueOnce(mockResponse);

      await blogPostsController.getPostBySearchTerm(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(BlogPosts.findAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockJson.mock.calls[0][0]).toBe(mockResponse);
    });
    it('if database return an error with status code 500', async () => {
      const mockQuery = { q: 1 };
      const mockReq = { query: mockQuery };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'findAll').mockImplementationOnce(() => { throw new Error(mockError); });
      await blogPostsController.getPostBySearchTerm(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
  describe('testando endpoint DELETE /post/:id', () => {
    it('if returning success with status 200', async () => {
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockParams = { id: 1 };
      const mockReq = { user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockData = {
        id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', image: null,
      };
      const mockResponse = {
        dataValues: mockData,
      };

      jest.restoreAllMocks();

      jest.spyOn(blogPostsService, 'validateUser').mockReturnValueOnce(true);
      jest.spyOn(BlogPosts, 'destroy').mockReturnValueOnce(mockResponse);

      await blogPostsController.deletePostById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(0);
      expect(mockEnd).toHaveBeenCalledTimes(1);
      expect(BlogPosts.destroy).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    it('if user email was different from post', async () => {
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockParams = { id: 1 };
      const mockReq = { user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Operação não permitida', code: 'access_denied' };

      jest.restoreAllMocks();

      jest.spyOn(blogPostsService, 'validateUser').mockReturnValueOnce(mockError);
      await blogPostsController.deletePostById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if database return an error with status code 500', async () => {
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockParams = { id: 1 };
      const mockReq = { user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

      jest.restoreAllMocks();

      jest.spyOn(BlogPosts, 'destroy').mockImplementationOnce(() => { throw new Error(mockError); });
      jest.spyOn(blogPostsService, 'validateUser').mockReturnValueOnce(true);
      await blogPostsController.deletePostById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    it('if deleted post return null', async () => {
      const mockUser = { email: 'jctaraujo@hotmail.com' };
      const mockParams = { id: 1 };
      const mockReq = { user: mockUser, params: mockParams };
      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockNext = jest.fn();
      const mockError = { error: 'Post não existe', code: 'not_found' };

      jest.restoreAllMocks();

      jest.spyOn(blogPostsService, 'deleteById').mockReturnValueOnce(null);
      jest.spyOn(blogPostsService, 'validateUser').mockReturnValueOnce(true);
      await blogPostsController.deletePostById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
