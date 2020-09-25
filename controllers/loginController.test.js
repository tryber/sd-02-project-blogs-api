const loginService = require('../services/loginService');
const loginController = require('./loginController');
// const errorController = require('./errorController');
const { Users } = require('../models');

describe('Test login controller, service', () => {
  it('if login was a success and returning token and status 200', async () => {
    const mockBody = { email: 'jctaraujo@hotmail.com', password: '123456' };
    const mockReq = { body: mockBody };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockNext = jest.fn();
    const mockData = {
      id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', imagel: null,
    };
    const mockResponse = { dataValues: mockData };
    jest.spyOn(Users, 'findOne').mockReturnValueOnce(mockResponse);

    await loginController.login(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(Users.findOne).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockJson.mock.calls[0][0].token).not.toBeNull();
  });
  it('if email was wrong format and returning error with status code 401', async () => {
    const mockBody = { email: 'jctaraujo', password: '123456' };
    const mockReq = { body: mockBody };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockNext = jest.fn();
    const mockError = { error: 'Campos inválidos', code: 'bad_request' };

    jest.restoreAllMocks();

    jest.spyOn(loginService, 'getUser');
    await loginController.login(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(loginService.getUser).not.toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
  it('if password was wrong and returning error with status code 401', async () => {
    const mockBody = { email: 'jctaraujo@hotmail.com', password: '123457' };
    const mockReq = { body: mockBody };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockNext = jest.fn();
    const mockError = { error: 'Campos inválidos', code: 'bad_request' };
    const mockData = {
      id: 1, displayName: 'Julio Cezar', email: 'jctaraujo@hotmail.com', password: '123456', imagel: null,
    };
    const mockResponse = { dataValues: mockData };

    jest.restoreAllMocks();

    jest.spyOn(Users, 'findOne').mockReturnValueOnce(mockResponse);
    await loginController.login(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockRes.status).not.toHaveBeenCalled();
  });
  it('if database return an error with status code 500', async () => {
    const mockBody = { email: 'jctaraujo@hotmail.com', password: '123456' };
    const mockReq = { body: mockBody };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockNext = jest.fn();
    const mockError = { error: 'Erro no banco de dados', code: 'internal_error' };

    jest.restoreAllMocks();

    jest.spyOn(Users, 'findOne').mockImplementationOnce(() => { throw new Error(mockError); });
    await loginController.login(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
