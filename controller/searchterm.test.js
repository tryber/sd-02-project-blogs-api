const blog = require('./blog');
const { BlogPosts } = require('../models');

describe('test blog Controller getForText', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = [
        {
          dataValues: {
            id: 1,
            published: '2020-08-14T20:10:59.000Z',
            updated: '2020-08-14T20:10:59.000Z',
            title: 'Latest updates, August 1st',
            content: 'The whole text for the blog post goes here in this key',
            user_id: 1,
            user: {
              id: 1,
              displayName: 'Brett Wiltshire',
              email: 'brett@email.com',
              image:
                'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
            },
          },
        },
      ];

      const getPost = jest.spyOn(BlogPosts, 'findAll').mockReturnValueOnce(mockData);

      const mockJson = jest.fn();
      const mockRes = {
        status: jest.fn().mockReturnValueOnce({ json: mockJson }),
      };
      const mockReq = { query: { q: 'blog' } };
      const next = jest.fn();

      await blog.getForText(mockReq, mockRes, next);

      expect(getPost).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockData);

      getPost.mockRestore();
    });
    it('test void array return', async () => {
      const mockData = [];

      const getPost = jest.spyOn(BlogPosts, 'findAll').mockReturnValueOnce(mockData);

      const mockJson = jest.fn();
      const mockRes = {
        status: jest.fn().mockReturnValueOnce({ json: mockJson }),
      };
      const mockReq = { query: { q: 'banana' } };
      const next = jest.fn();

      await blog.getForText(mockReq, mockRes, next);

      expect(getPost).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockData);

      getPost.mockRestore();
    });
  });
});
