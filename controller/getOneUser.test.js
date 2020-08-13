const userController = require('./user');
const { Users } = require('../models');

describe('test user Controller getOneUser', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = {
        id: 1,
        displayName: 'douglas henrique',
        email: 'dougaa@email.com',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
      };

      const getUser = jest
        .spyOn(Users, 'findOne')
        .mockReturnValueOnce(mockData);

      const mockJson = jest.fn();
      const mockRes = {
        status: jest.fn().mockReturnValueOnce({ json: mockJson }),
      };
      const mockReq = { params: { id: 1 } };
      const next = jest.fn();

      await userController.getUser(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockData);

      getUser.mockRestore();
    });
  });
});
