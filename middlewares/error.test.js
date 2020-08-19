const errorMid = require('./errorMid');

describe('test error mid', () => {
  it('success case 400', () => {
    const mockErr = { code: 'invalid_data', message: 'erro' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    errorMid(mockErr, {}, mockRes, {});
    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({ err: mockErr });
  });
  it('success case 401', () => {
    const mockErr = { code: 'unauthorized', message: 'erro' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    errorMid(mockErr, {}, mockRes, {});
    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(401);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({ err: mockErr });
  });
  it('success case 403', () => {
    const mockErr = { code: 'forbidden', message: 'erro' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    errorMid(mockErr, {}, mockRes, {});
    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(403);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({ err: mockErr });
  });
  it('success case 404', () => {
    const mockErr = { code: 'not_found', message: 'erro' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    errorMid(mockErr, {}, mockRes, {});
    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({ err: mockErr });
  });
  it('success case 409', () => {
    const mockErr = { code: 'conflict', message: 'erro' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    errorMid(mockErr, {}, mockRes, {});
    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(409);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({ err: mockErr });
  });
  it('success case 500', () => {
    const mockErr = { code: 'internal_error', message: 'erro' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    errorMid(mockErr, {}, mockRes, {});
    expect(mockRes.status).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({ err: mockErr });
  });
});
