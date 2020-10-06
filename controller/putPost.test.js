const blog = require('./blog');
const { BlogPosts } = require('../models');

describe('test blog Controller putPost', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = {
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
      };

      const putPost = jest.spyOn(BlogPosts, 'update').mockReturnValueOnce(1);

      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockReq = { params: { id: 1 }, body: { ...mockData } };
      const next = jest.fn();

      await blog.putPost(mockReq, mockRes, next);

      expect(putPost).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(204);
      expect(mockEnd).toBeCalledWith();

      putPost.mockRestore();
    });
  });
  describe('fail cases', () => {
    it('test fail return no title', async () => {
      const mockData = {
        content: 'The whole text for the blog post goes here in this key',
      };

      const putPost = jest.spyOn(BlogPosts, 'update').mockReturnValueOnce(1);

      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockReq = { params: { id: 1 }, body: { ...mockData } };
      const next = jest.fn();

      await blog.putPost(mockReq, mockRes, next);

      expect(putPost).not.toBeCalledTimes(1);
      expect(mockRes.status).not.toBeCalledWith(204);
      expect(mockEnd).not.toBeCalledWith();
      expect(next).toBeCalledWith({ code: 'invalid_data', message: 'Campos inválidos' });
      putPost.mockRestore();
    });
    it('test fail return no content', async () => {
      const mockData = {
        title: 'Latest updates, August 1st',
      };

      const putPost = jest.spyOn(BlogPosts, 'update').mockReturnValueOnce(1);

      const mockEnd = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ end: mockEnd }) };
      const mockReq = { params: { id: 1 }, body: { ...mockData } };
      const next = jest.fn();

      await blog.putPost(mockReq, mockRes, next);

      expect(putPost).not.toBeCalledTimes(1);
      expect(mockRes.status).not.toBeCalledWith(204);
      expect(mockEnd).not.toBeCalledWith();
      expect(next).toBeCalledWith({ code: 'invalid_data', message: 'Campos inválidos' });
      putPost.mockRestore();
    });
  });
});
