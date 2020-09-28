const { Post } = require('../models');
const {
  createNewPost,
  getAllPosts,
  updatePost,
  searchPosts,
  getSinglePost,
  deletePost,
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
  describe('Exibir todos os posts', () => {
    it('Quando é feita uma requisição GET para o endpoint /post retorna um array com todos os posts sem o user_id da tabela Posts', async () => {
      const mockFindAll = jest
        .spyOn(Post, 'findAll')
        .mockResolvedValue([
          {
            id: 1,
            title: 'Latest updates, August 1st',
            content: 'The whole text for the blog post goes here in this key',
            published: '2020-09-22T16:30:25.000Z',
            updated: '2020-09-22T16:30:25.000Z',
            user: {
              id: 1,
              displayName: 'Guilherme Crespo',
              email: 'gui@gui.com',
              password: '123456',
              image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
            },
          },
          {
            id: 3,
            title: 'Latest updates, August 2st',
            content: 'The whole text for the blog post goes here in this key lalala',
            published: '2020-09-25T16:44:28.000Z',
            updated: '2020-09-25T16:44:28.000Z',
            user: {
              id: 1,
              displayName: 'Guilherme Crespo',
              email: 'gui@gui.com',
              password: '123456',
              image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
            },
          },
          {
            id: 4,
            title: 'Latest updates, August ast',
            content: 'The whole text for the blog post goes here in this key alanal',
            published: '2020-09-28T00:24:06.000Z',
            updated: '2020-09-28T00:24:06.000Z',
            user: {
              id: 5,
              displayName: 'Alan Parsons',
              email: 'alan@alan.com',
              password: 'alanal',
              image: 'https://www.gannett-cdn.com/-mm-/3690a3782bc4a2b9b35fc50bf175c54642c2ca9d/c=0-9-2968-3966/local/-/media/2016/03/22/Phoenix/Phoenix/635942084911874569-GettyImages-464294501.jpg?width=534&height=712&fit=crop',
            },
          },
        ]);

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await getAllPosts(null, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON.mock.calls[0][0]).toBeInstanceOf(Array);
      mockJSON.mock.calls[0][0].forEach((post) => expect(post).not.toHaveProperty('user_id'));
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockUserModel = jest
        .spyOn(Post, 'findAll')
        .mockRejectedValue(new Error());

      await getAllPosts(null, mockRes);

      expect(mockUserModel).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });
  describe('Atualizar post', () => {
    it('Quando fornecidos os dados corretos, atualiza o title/content em um post do autor ou autora da requisição e retorna 200', async () => {
      const mockReq = {
        body: {
          title: 'Latest updates, October 1st',
          content: 'The whole text for the blog post goes here in this key ihhh',
        },
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockJSON = jest.fn();

      const mockFindOne = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue({
          ...mockReq.body,
          id: mockReq.params.id,
          user_id: mockReq.user.id,
          updated: '2020-09-22 16:30:25',
          published: '2020-09-22 16:30:25',
        });

      const mockPostModel = jest
        .spyOn(Post, 'update')
        .mockResolvedValue([1]);

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await updatePost(mockReq, mockRes);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockPostModel).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
    });

    it('Quando uma pessoa diferente de quem criou o post fizer a requisição, deve retornar um código status 403', async () => {
      const mockReq = {
        body: {
          title: 'Latest updates, October 1st',
          content: 'The whole text for the blog post goes here in this key ihhh',
        },
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockJSON = jest.fn();

      const mockFindOne = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue({
          ...mockReq.body,
          id: mockReq.params.id,
          user_id: 1,
          updated: '2020-09-22 16:30:25',
          published: '2020-09-22 16:30:25',
        });

      const mockPostModel = jest
        .spyOn(Post, 'update')
        .mockResolvedValue();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await updatePost(mockReq, mockRes);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockPostModel).not.toHaveBeenCalled();
      expect(mockRes.status).toBeCalledWith(403);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('Você só pode alterar seus próprios posts');
    });

    it('Quando falta o title ou o content, retorna o status 400 e uma mensagem de erro', async () => {
      const mockReq = {
        body: {
          title: 'Latest updates, October 1st',
          content: '',
        },
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockJSON = jest.fn();

      const mockFindOne = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue({
          ...mockReq.body,
          id: mockReq.params.id,
          user_id: mockReq.user.id,
          updated: '2020-09-22 16:30:25',
          published: '2020-09-22 16:30:25',
        });

      const mockPostModel = jest
        .spyOn(Post, 'update')
        .mockResolvedValue();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await updatePost(mockReq, mockRes);

      expect(mockFindOne).not.toHaveBeenCalled();
      expect(mockPostModel).not.toHaveBeenCalled();
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('sua requisição deve conter um title e um content e devem ser strings');
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockReq = {
        body: {
          title: 'Latest updates, October 1st',
          content: 'The whole text for the blog post goes here in this key ihhh',
        },
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockUserModel = jest
        .spyOn(Post, 'update')
        .mockRejectedValue(new Error());

      await updatePost(mockReq, mockRes);

      expect(mockUserModel).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });
  describe('Exibir um post', () => {
    it('Quando é feita uma requisição GET para o endpoint /post/:id retorna um objeto com os detalhes do post com id correspondente', async () => {
      const result = {
        id: 1,
        title: 'Latest updates, October ast',
        content: 'The whole text for the blog post goes here in this key alanal',
        published: '2020-09-22T16:30:25.000Z',
        updated: '2020-09-28T01:18:53.000Z',
        user: {
          id: 1,
          displayName: 'Guilherme Crespo',
          email: 'gui@gui.com',
          image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
        },
      };

      const mockFindUser = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue(result);

      const mockReq = {
        params: {
          id: 1,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await getSinglePost(mockReq, mockRes);

      expect(mockFindUser).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON.mock.calls[0][0]).toStrictEqual(result);
      expect(mockJSON.mock.calls[0][0].user).not.toHaveProperty('password');
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockReq = {
        params: {
          id: 1,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockUserModel = jest
        .spyOn(Post, 'findOne')
        .mockRejectedValue(new Error());

      await getSinglePost(mockReq, mockRes);

      expect(mockUserModel).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });
  describe('Procurar por posts', () => {
    it('Quando digitado um termo de busca, deve retornar um array com todos os posts que contiverem aquele termo no title ou no content', async () => {
      const mockReq = {
        query: {
          q: 'ast',
        },
      };

      const mockResult = [
        {
          id: 1,
          title: 'Latest updates, October 1st',
          content: 'The whole text for the blog post goes here in this key alanal ast',
          published: '2020-09-22T16:30:25.000Z',
          updated: '2020-09-28T01:18:53.000Z',
          user: {
            id: 1,
            displayName: 'Guilherme Crespo',
            email: 'gui@gui.com',
            password: '123456',
            image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
          },
        },
        {
          id: 4,
          title: 'Latest updates, September 3st',
          content: 'The whole text for the blog post goes here in this key alanal',
          published: '2020-09-28T00:24:06.000Z',
          updated: '2020-09-28T01:19:59.000Z',
          user: {
            id: 5,
            displayName: 'Alan Parsons',
            email: 'alan@alan.com',
            password: 'alanal',
            image: 'https://www.gannett-cdn.com/-mm-/3690a3782bc4a2b9b35fc50bf175c54642c2ca9d/c=0-9-2968-3966/local/-/media/2016/03/22/Phoenix/Phoenix/635942084911874569-GettyImages-464294501.jpg?width=534&height=712&fit=crop',
          },
        },
        {
          id: 5,
          title: 'Latest updates, August ast',
          content: 'The whole text for the blog post goes here in this key alanal',
          published: '2020-09-28T01:00:27.000Z',
          updated: '2020-09-28T01:00:27.000Z',
          user: {
            id: 5,
            displayName: 'Alan Parsons',
            email: 'alan@alan.com',
            password: 'alanal',
            image: 'https://www.gannett-cdn.com/-mm-/3690a3782bc4a2b9b35fc50bf175c54642c2ca9d/c=0-9-2968-3966/local/-/media/2016/03/22/Phoenix/Phoenix/635942084911874569-GettyImages-464294501.jpg?width=534&height=712&fit=crop',
          },
        },
      ];

      const mockJSON = jest.fn();

      const mockFindAll = jest
        .spyOn(Post, 'findAll')
        .mockResolvedValue(mockResult);

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await searchPosts(mockReq, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON).toBeCalledWith(mockResult);
      expect(mockJSON.mock.calls[0][0]).toBeInstanceOf(Array);
      mockJSON.mock.calls[0][0].forEach((post) => expect(post).not.toHaveProperty('user_id'));
    });

    it('Quando digitado um termo de busca e nada for encontrado, retorna um array vazio', async () => {
      const mockReq = {
        query: {
          q: 'lalalal',
        },
      };

      const mockJSON = jest.fn();

      const mockFindAll = jest
        .spyOn(Post, 'findAll')
        .mockResolvedValue([]);

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await searchPosts(mockReq, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJSON.mock.calls[0][0]).toBeInstanceOf(Array);
      expect(mockJSON.mock.calls[0][0].length).toBe(0);
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockReq = {
        query: {
          q: 'ast',
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockUserModel = jest
        .spyOn(Post, 'findAll')
        .mockRejectedValue(new Error());

      await searchPosts(mockReq, mockRes);

      expect(mockUserModel).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });
  describe('Deletar um post', () => {
    it('Quando fornecidos os dados corretos, deleta post do autor ou autora da requisição e retorna 200', async () => {
      const mockReq = {
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockFindOne = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue({
          id: 4,
          user_id: 5,
          title: 'Latest updates, October 1st',
          content: 'The whole text for the blog post goes here in this key alanal ast',
          published: '2020-09-22T16:30:25.000Z',
          updated: '2020-09-28T01:18:53.000Z',
          user: {
            id: 5,
            displayName: 'Guilherme Crespo',
            email: 'gui@gui.com',
            password: '123456',
            image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
          },
        });

      const mockDestroy = jest
        .spyOn(Post, 'destroy')
        .mockResolvedValue(true);

      const mockRes = {
        status: jest.fn().mockImplementation(() => ({ end: jest.fn() })),
      };

      await deletePost(mockReq, mockRes);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockDestroy).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
    });

    it('Quando uma pessoa diferente de quem criou o post fizer a requisição, deve retornar um código status 403', async () => {
      const mockReq = {
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockJSON = jest.fn();

      const mockFindOne = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue({
          id: 4,
          user_id: 4,
          title: 'Latest updates, October 1st',
          content: 'The whole text for the blog post goes here in this key alanal ast',
          published: '2020-09-22T16:30:25.000Z',
          updated: '2020-09-28T01:18:53.000Z',
          user: {
            id: 4,
            displayName: 'Guilherme Crespo',
            email: 'gui@gui.com',
            password: '123456',
            image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
          },
        });

      const mockPostModel = jest
        .spyOn(Post, 'destroy')
        .mockResolvedValue();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await deletePost(mockReq, mockRes);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockPostModel).not.toHaveBeenCalled();
      expect(mockRes.status).toBeCalledWith(403);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('Você só pode deletar seus próprios posts');
    });

    it('Quando o post não é encontrado, deve retornar um código status 404', async () => {
      const mockReq = {
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockJSON = jest.fn();

      const mockFindOne = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue();

      const mockPostModel = jest
        .spyOn(Post, 'destroy')
        .mockResolvedValue();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      await deletePost(mockReq, mockRes);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockPostModel).not.toHaveBeenCalled();
      expect(mockRes.status).toBeCalledWith(404);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('Nenhum post encontrado');
    });

    it('Quando há um erro na conexão com o banco de dados, retorna o status 500 e uma mensagem', async () => {
      jest.spyOn(console, 'error').mockReturnValueOnce();

      const mockReq = {
        user: {
          id: 5,
        },
        params: {
          id: 4,
        },
      };

      const mockJSON = jest.fn();

      const mockRes = {
        status: jest.fn().mockReturnValue({ json: mockJSON }),
      };

      const mockFindOne = jest
        .spyOn(Post, 'findOne')
        .mockResolvedValue({
          id: 4,
          user_id: 5,
          title: 'Latest updates, October 1st',
          content: 'The whole text for the blog post goes here in this key alanal ast',
          published: '2020-09-22T16:30:25.000Z',
          updated: '2020-09-28T01:18:53.000Z',
          user: {
            id: 5,
            displayName: 'Guilherme Crespo',
            email: 'gui@gui.com',
            password: '123456',
            image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
          },
        });

      const mockDestroy = jest
        .spyOn(Post, 'destroy')
        .mockRejectedValue(new Error());

      await deletePost(mockReq, mockRes);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockDestroy).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJSON.mock.calls[0][0]).toHaveProperty('message');
      expect(mockJSON.mock.calls[0][0].message).toBe('erro na conexão com base de dados');
    });
  });
});
