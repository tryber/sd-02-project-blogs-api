const userController = require('./user');
const { Users } = require('../models');
const jwt = require('jsonwebtoken');

describe('test user Controller', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = {
        displayName: "douglas henrique",
        email: "dougaa@email.com",
        password: 123456,
        image: "http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png"
      };

      const getUser = jest
        .spyOn(Users, 'findOne')
        .mockReturnValueOnce(null);

      const createUser = jest
        .spyOn(Users, 'create')
        .mockReturnValueOnce(null);

      const createToken = jest
        .spyOn(jwt, 'sign')
        .mockReturnValueOnce('trybetoken');

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { body: { ...mockData } };
      const next = jest.fn();

      await userController.postUser(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(createUser).toBeCalledTimes(1);
      expect(createToken).toBeCalledTimes(1);

      expect(mockJson).toBeCalledWith({ token: 'trybetoken' });
      expect(mockRes.status).toBeCalledWith(201);

      getUser.mockRestore();
      createUser.mockRestore();
      createToken.mockRestore();
    });
  });
});

