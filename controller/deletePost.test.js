const blog = require('./blog');
const { BlogPosts } = require('../models');

describe('test blog Controller deletePost', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const deletePost = jest.spyOn(BlogPosts, 'destroy').mockReturnValueOnce();

      const mockEnd = jest.fn();
      const mockRes = {
        status: jest.fn().mockReturnValueOnce({ end: mockEnd }),
      };
      const mockReq = { params: { id: 1 } };
      const next = jest.fn();

      await blog.deletePost(mockReq, mockRes, next);

      expect(deletePost).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(204);
      expect(mockEnd).toBeCalledWith();

      deletePost.mockRestore();
    });
  });
});
