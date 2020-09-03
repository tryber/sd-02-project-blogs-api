const { promiseErrors, endpointNotFound } = require('./errors');

describe('Errors middleware tests', () => {
  test('if returns response with status code and message when status code is not 500', async () => {
    const errMsg = { error: true, message: '"email" must be a valid email', code: 'bad_request' };
    const mockErr = errMsg;
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockResponse = { message: '"email" must be a valid email' };

    await promiseErrors(mockErr, null, mockRes, null);

    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith(mockResponse);
  });

  test('if returns response with status code and message when status code is 500', async () => {
    const errMsg = { message: 'connect ECONNREFUSED 127.0.0.1:3306' };
    const mockErr = errMsg;
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockResponse = { message: 'connect ECONNREFUSED 127.0.0.1:3306' };

    await promiseErrors(mockErr, null, mockRes, null);

    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJson).toBeCalledWith(mockResponse);
  });

  test('if no endpoint was found, return an error stating this', async () => {
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const mockResponse = { message: 'Endpoint não encontrado' };

    await endpointNotFound(null, mockRes);

    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJson).toBeCalledWith(mockResponse);
  });
});
