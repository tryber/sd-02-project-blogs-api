const userController = require('./user');
const { Users } = require('../models');

describe('test user Controller login', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const deleteUser = jest
        .spyOn(Users, 'destroy')
        .mockReturnValueOnce();

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = { user: { id: 1 } };

      await userController.deleteUser(mockReq, mockRes);

      expect(deleteUser).toBeCalledTimes(1);

      expect(mockJson).toBeCalledWith();
      expect(mockRes.status).toBeCalledWith(204);

      deleteUser.mockRestore();
    });
  });
});
