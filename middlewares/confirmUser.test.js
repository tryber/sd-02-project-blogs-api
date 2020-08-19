const confirmUser = require('./confirmUser');
const { BlogPosts } = require('../models');

describe('test confirmUser', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = {
        dataValues: {
          id: 1,
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.000Z',
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
          user_id: 1,
          user: {
            dataValues: {
              id: 1,
              displayName: 'Brett Wiltshire',
              email: 'brett@email.com',
              image:
                'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
            },
          },
        },
      };

      const getUser = jest.spyOn(BlogPosts, 'findOne').mockReturnValueOnce(mockData);
      const mockReq = { user: { id: 1 }, params: { id: 1 } };
      const next = jest.fn();

      await confirmUser(mockReq, {}, next);

      expect(getUser).toBeCalledTimes(1);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith();

      getUser.mockRestore();
    });
  });
  describe('test error cases', () => {
    it('test return null value', async () => {
      const getUser = jest.spyOn(BlogPosts, 'findOne').mockReturnValueOnce(null);
      const mockReq = { user: { id: 1 }, params: { id: 1 } };
      const next = jest.fn();

      await confirmUser(mockReq, {}, next);

      expect(getUser).toBeCalledTimes(1);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith({ message: 'Postagem não encontrada', code: 'not_found' });

      getUser.mockRestore();
    });
    it('test return invalid value', async () => {
      const mockData = {
        dataValues: {
          id: 1,
          published: '2011-08-01T19:58:00.000Z',
          updated: '2011-08-01T19:58:51.000Z',
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
          user_id: 1,
          user: {
            dataValues: {
              id: 2,
              displayName: 'Brett Wiltshire',
              email: 'brett@email.com',
              image:
                'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
            },
          },
        },
      };
      const getUser = jest.spyOn(BlogPosts, 'findOne').mockReturnValueOnce(mockData);
      const mockReq = { user: { id: 1 }, params: { id: 1 } };
      const next = jest.fn();

      await confirmUser(mockReq, {}, next);

      expect(getUser).toBeCalledTimes(1);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith({ message: 'Atualização proibida', code: 'forbidden' });

      getUser.mockRestore();
    });
  });
});
