const jwt = require('jsonwebtoken');
const auth = require('./auth');
const { Users } = require('../models');

describe('test auth', () => {
  it('success case', async () => {
    const mockData = {
      data: {
        email: 'dougaa@email.com',
        password: '123456',
      },
    };
    const mockUser = {
      dataValues: {
        displayName: 'douglas henrique',
        email: 'dougaa@email.com',
        password: '123456',
        image:
          'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    };

    const verifyToken = jest.spyOn(jwt, 'verify').mockReturnValueOnce(mockData);
    const findBy = jest.spyOn(Users, 'findOne').mockReturnValueOnce(mockUser);
    const mockReq = { user: '', headers: { authorization: 'token' } };
    const next = jest.fn();

    await auth(mockReq, {}, next);

    expect(verifyToken).toBeCalledTimes(1);
    expect(verifyToken).toBeCalledWith('token', 'trybe');
    expect(findBy).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
    expect(next).toBeCalledTimes(1);
    expect(mockReq.user).toEqual({ email: 'dougaa@email.com', password: '123456' });

    verifyToken.mockRestore();
    findBy.mockRestore();
  });
  describe('Fail cases', () => {
    it('no token', async () => {
      const mockReq = { user: '', headers: {} };
      const next = jest.fn();

      await auth(mockReq, {}, next);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith({ message: 'Token not found or reported', code: 'unauthorized' });
    });
    it('fail request', async () => {
      const mockData = {
        data: {
          email: 'dougaa@email.com',
          password: '123456',
        },
      };

      const verifyToken = jest.spyOn(jwt, 'verify').mockReturnValueOnce(mockData);
      const findBy = jest.spyOn(Users, 'findOne').mockReturnValueOnce(null);
      const mockReq = { user: '', headers: { authorization: 'token' } };
      const next = jest.fn();

      await auth(mockReq, {}, next);

      expect(verifyToken).toBeCalledTimes(1);
      expect(verifyToken).toBeCalledWith('token', 'trybe');
      expect(findBy).toBeCalledTimes(1);
      expect(next).toBeCalledWith({ message: 'User not found', code: 'unauthorized' });

      verifyToken.mockRestore();
      findBy.mockRestore();
    });
    it('token invalid', async () => {
      const mockReq = { user: '', headers: {} };
      const next = jest.fn();
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await auth(mockReq, {}, next);
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith({ message: 'Token not found or reported', code: 'unauthorized' });
    });
  });
});
