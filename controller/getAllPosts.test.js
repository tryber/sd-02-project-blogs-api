const blogController = require('./blog');
const { BlogPosts } = require('../models');

describe('test user Controller getAllblogPosts', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = [
        {
          dataValues: {
            id: 1,
            published: '2011-08-01T19:58:00.000Z',
            updated: '2011-08-01T19:58:51.000Z',
            title: 'Latest updates, August 1st',
            content: 'The whole text for the blog post goes here in this key',
            user_id: 1,
            user: {
              id: 1,
              displayName: 'Brett Wiltshire',
              email: 'brett@email.com',
              image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
            },
          }
        },
        {
          dataValues: {
            id: 2,
            published: '2020-08-14T20:10:59.000Z',
            updated: '2020-08-14T20:10:59.000Z',
            title: 'Latest updates, August 1st',
            content: 'The whole text for the blog post goes here in this key',
            user_id: 1,
            user: {
              id: 1,
              displayName: 'Brett Wiltshire',
              email: 'brett@email.com',
              image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
            },
          },
        },
      ];

      const getPosts = jest
        .spyOn(BlogPosts, 'findAll')
        .mockReturnValueOnce(mockData);

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = {};
      const next = jest.fn();

      await blogController.getAllPosts(mockReq, mockRes, next);

      expect(getPosts).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockData.map(({ dataValues }) => dataValues));

      getPosts.mockRestore();
    });
  });
  it('test return null value', async () => {
    const getPosts = jest
      .spyOn(BlogPosts, 'findAll')
      .mockReturnValueOnce(null);

    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockReq = {};
    const next = jest.fn();

    await blogController.getAllPosts(mockReq, mockRes, next);

    expect(getPosts).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith([]);

    getPosts.mockRestore();
  });
});