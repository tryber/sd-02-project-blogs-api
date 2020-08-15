const { errorController } = require('./errorController');

const error1 = { code: 'invalid_data', message: 'message 1' };
const error2 = { code: 'unauthorized', message: 'message 2' };

describe('Error Controller Test', () => {
  test('Error Controller working fine for the first error!', () => {
    const mockRes = { status: jest.fn(), json: jest.fn() };
    errorController(error1, {}, mockRes, {});

    expect(mockRes.status).toBeCalledWith(422);
    expect(mockRes.json).toBeCalledWith({ message: 'message 1' });
  });

  test('Error Controller working fine for the second error!', () => {
    const mockRes = { status: jest.fn(), json: jest.fn() };
    errorController(error2, {}, mockRes, {});

    expect(mockRes.status).toBeCalledWith(400);
    expect(mockRes.json).toBeCalledWith({ message: 'message 2' });
  });
});
