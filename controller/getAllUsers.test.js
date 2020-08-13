const userController = require('./user');
const { Users } = require('../models');

describe('test user Controller getUsers', () => {
  describe('success cases', () => {
    it('test correct return', async () => {
      const mockData = [{
        dataValues: {
          displayName: 'douglas henrique',
          email: 'dougaa@email.com',
          image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
        }
      }, {
        dataValues:
        {
          displayName: 'douglas não henrique',
          email: 'dougas@email.com',
          image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png'
        }
      }];

      const getUser = jest
        .spyOn(Users, 'findAll')
        .mockReturnValueOnce(mockData);

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = {};
      const next = jest.fn();

      await userController.getUsers(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockData.map(({ dataValues }) => dataValues));

      getUser.mockRestore();
    });
    it('test correct return in no result', async () => {
      const mockData = [];

      const getUser = jest
        .spyOn(Users, 'findAll')
        .mockReturnValueOnce(mockData);

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = {};
      const next = jest.fn();

      await userController.getUsers(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith([]);

      getUser.mockRestore();
    });
    it('test correct return in undefined result', async () => {
      const mockData = [];

      const getUser = jest
        .spyOn(Users, 'findAll')
        .mockReturnValueOnce(undefined);

      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockReq = {};
      const next = jest.fn();

      await userController.getUsers(mockReq, mockRes, next);

      expect(getUser).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockData);

      getUser.mockRestore();
    });
  });

});

