const { User } = require('../models');
const usersController = require('./usersController');

const createSpy = (func, method, value) => jest
  .spyOn(func, method)
  .mockReturnValueOnce(value);

const createSpyError = (func, method) => jest
  .spyOn(func, method)
  .mockImplementation(() => {
    throw new Error();
  });

const allUsersMock = [
  {
    id: 1,
    displayName: 'Brett Wiltshire',
    email: 'brett@email.com',
    image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
  },
  {
    id: 2,
    displayName: 'Pedro Henrique',
    email: 'pedro@gmail.com',
    image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/pedro.png',
  },
];

describe('usersController test', () => {
  describe('Get all users', () => {
    test('Sucesfull request', async () => {
      const findingUserSpy = createSpy(User, 'findAll', allUsersMock);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await usersController.getUsers({}, mockRes, mockNext);

      expect(findingUserSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith(allUsersMock);

      findingUserSpy.mockRestore();
    });

    test('Something went wrong', async () => {
      const findingUserSpy = createSpyError(User, 'findAll');

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await usersController.getUsers({}, mockRes, mockNext);

      expect(findingUserSpy).toBeCalledTimes(1);

      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });

      findingUserSpy.mockRestore();
    });
  });

  describe('Get user By ID', () => {
    test('Sucesfull request', async () => {
      const findingUserSpy = createSpy(User, 'findByPk', allUsersMock[1]);

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await usersController.getUser({ params: { id: 2 } }, mockRes, mockNext);

      const atributes = { attributes: ['id', 'displayName', 'email', 'image'] };
      expect(findingUserSpy).toBeCalledTimes(1);
      expect(findingUserSpy).toBeCalledWith(2, atributes);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith(allUsersMock[1]);

      findingUserSpy.mockRestore();
    });

    test('Something went wrong', async () => {
      const findingUserSpy = createSpyError(User, 'findByPk');

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await usersController.getUser({ params: 1 }, mockRes, mockNext);

      expect(findingUserSpy).toBeCalledTimes(1);

      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });

      findingUserSpy.mockRestore();
    });
  });

  describe('Deleting user', () => {
    test('Deleted user succesfully', async () => {
      const deleteUserSpy = createSpy(User, 'destroy');

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await usersController.deleteUser({ user: [{ dataValues: 'valores' }] }, mockRes, mockNext);

      expect(deleteUserSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith({ message: 'User deleted' });

      deleteUserSpy.mockRestore();
    });
    test('Try and catch error', async () => {
      const deleteUserSpy = createSpyError(User, 'destroy');

      const mockRes = { status: jest.fn(), json: jest.fn() };
      const mockNext = jest.fn();
      await usersController.deleteUser({ user: [{ dataValues: 'valores' }] }, mockRes, mockNext);

      expect(deleteUserSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith({ code: 'something_wrong', message: 'Something went wrong' });

      deleteUserSpy.mockRestore();
    });
  });
});
