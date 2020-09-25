const { Post } = require('../models');
const {
  createNewPost,
} = require('./PostController');

afterEach(() => {
  jest.clearAllMocks();
});

describe('PostController', () => {
  describe('Criação de novo post', () => {
    it('Quando fornecidos dados corretos, cria um post no banco e retorna o status 201 e o post criado', async () => {
      const mockReq = {
        body: {
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
        },
        user: {
          id: 1,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const date = new Date();

      const mockPostModel = jest
        .spyOn(Post, 'create')
        .mockResolvedValue({
          ...mockReq.body,
          id: 1,
          user_id: 1,
          updated: date,
          published: date,
        });

      await createNewPost(mockReq, mockRes);

      expect(mockPostModel).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJSON).toBeCalledWith({
        post: {
          content: 'The whole text for the blog post goes here in this key',
          id: 1,
          published: date,
          title: 'Latest updates, August 1st',
          updated: date,
          user_id: 1,
        },
      });
    });
    it('Quando falta o title ou o content, retorna o status 400 e uma mensagem de erro', async () => {
      const mockReq = {
        body: {
          title: '',
          content: 'The whole text for the blog post goes here in this key',
        },
        user: {
          id: 1,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockPostModel = jest
        .spyOn(Post, 'create')
        .mockResolvedValue();

      await createNewPost(mockReq, mockRes);

      expect(mockPostModel).not.toHaveBeenCalled();
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('sua requisição deve conter um title e um content e devem ser strings');
    });
    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockReq = {
        body: {
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
        },
        user: {
          id: 1,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockUserModel = jest
        .spyOn(Post, 'create')
        .mockRejectedValue(new Error());

      await createNewPost(mockReq, mockRes);

      expect(mockUserModel).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });
});
