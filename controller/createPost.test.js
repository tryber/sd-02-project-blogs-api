const blog = require('./blog');
const { BlogPosts } = require('../models');

describe('test blog Controller createPost', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
      };

      const createPost = jest
        .spyOn(BlogPosts, 'create')
        .mockReturnValueOnce({
          ...mockData,
          user_id: 1,
          updated: '2020-08-14T20:17:26.583Z',
          published: '2020-08-14T20:17:26.583Z',
        });

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { user: { id: 1 }, body: { ...mockData } };
      const next = jest.fn();

      await blog.createPost(mockReq, mockRes, next);

      expect(createPost).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson).toBeCalledWith({
        ...mockData,
        user_id: 1,
        updated: '2020-08-14T20:17:26.583Z',
        published: '2020-08-14T20:17:26.583Z',
      });

      createPost.mockRestore();
    });
  });
  describe('fail cases', () => {
    it('test fail return no title', async () => {
      const mockData = {
        content: 'The whole text for the blog post goes here in this key',
      };

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { user: { id: 1 }, body: { ...mockData } };
      const next = jest.fn();

      await blog.createPost(mockReq, mockRes, next);

      expect(next).toBeCalledWith({ code: 'invalid_data', message: 'Campos inválidos' });
    });
    it('test fail return no content', async () => {
      const mockData = {
        title: 'Latest updates, August 1st',
      };

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { user: { id: 1 }, body: { ...mockData } };
      const next = jest.fn();

      await blog.createPost(mockReq, mockRes, next);

      expect(next).toBeCalledWith({ code: 'invalid_data', message: 'Campos inválidos' });
    });
  });
});
