const errorMiddleware = require('./error');

test('Se o erro contém o campo message, retorna essa mensagem de erro', () => {
  const mockError = {
    code: 'internal_error',
    message: 'Erro no servidor',
  };

  const mockErrorMessage = 'Erro no servidor';

  const mockJson = jest.fn();
  const mockRes = {
    status: jest
      .fn()
      .mockReturnValueOnce({ json: mockJson }),
  };

  errorMiddleware(mockError, null, mockRes, null);

  expect(mockRes.status).toBeCalledWith(500);
  expect(mockJson).toBeCalledWith({ message: mockErrorMessage });
});

test('Se o erro não contém o campo message, retorna a mensagem "Algo deu errado"', () => {
  const mockError = {
    code: 'internal_error',
  };

  const mockErrorMessage = 'Algo deu errado';

  const mockJson = jest.fn();
  const mockRes = {
    status: jest
      .fn()
      .mockReturnValueOnce({ json: mockJson }),
  };

  errorMiddleware(mockError, null, mockRes, null);

  expect(mockRes.status).toBeCalledWith(500);
  expect(mockJson).toBeCalledWith({ message: mockErrorMessage });
});
