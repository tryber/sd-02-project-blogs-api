const controller = require('../controller');
const { Blog_post } = require('../models');

const mockPost = { 
  id: 1,
  title: "Latest updates, August 1st",
  content: "The whole text for the blog post goes here in this key",
  userId: 1,
  updated: "2020-08-14T21:33:39.934Z",
  published: "2020-08-14T21:33:39.934Z"
};

const mockUser = {
  id: 1,
  displayName: 'Andrey Kenji',
  email: 'andreytsuzuki@gmail.com',
  password: '$2b$10$AFbJ4Du5TTISYtnMmf.ib.t766IgP2VfI9286gRW06gJqjdwBLp2S',
  image: 'hhth4',
};

describe('Post Model', () => {
  test('Insert Post', async () => {
    const mockBody = {
      title: "Latest updates, August 1st",
      content: "The whole text for the blog post goes here in this key",
    };

    const insertSpy = jest
      .spyOn(Blog_post, 'create')
      .mockReturnValueOnce(mockPost);
      
    const mockJson = jest.fn();
    const mockReq = { body: { ...mockBody }, user: { dataValues: { id: 1 } } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.post.insert(mockReq, mockRes);

    // Assert
    expect(insertSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockJson).toBeCalledWith(mockPost);

    insertSpy.mockRestore();
  });

  test('FindAll Posts', async () => {
    const mockPosts = [{ ...mockPost }];

    const findAllSpy = jest
      .spyOn(Blog_post, 'findAll')
      .mockReturnValueOnce(mockPosts);

    const mockJson = jest.fn();
    const mockReq = {};
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.post.findAll(mockReq, mockRes);

    // Assert
    expect(findAllSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith(mockPosts);

    findAllSpy.mockRestore();
  });

  test('UpdateById Post', async () => {
    const mockBody = { 
      title: "Latest updates, August 1s2",
      content: "The whole text for the blog post goes here in this key",
    };

    const mockUser = {
      dataValues: {
        userId: 1,
      },
    };

    const updateByIdSpy = jest
      .spyOn(Blog_post, 'update')
      .mockReturnValueOnce(mockPost);

    const findOneSpy = jest
      .spyOn(Blog_post, 'findOne')
      .mockReturnValueOnce(mockUser);

    const mockJson = jest.fn();
    const mockReq = { params: { id: 1 }, body: { ...mockBody }, user: { dataValues: { id: 1 } } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.post.updateById(mockReq, mockRes);

    // Assert
    expect(findOneSpy).toBeCalledTimes(1);
    expect(updateByIdSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith({ message: 'atualizado com sucesso' });

    updateByIdSpy.mockRestore();
    findOneSpy.mockRestore();
  });

  test('findById Post', async () => {
    const findByIdSpy = jest
      .spyOn(Blog_post, 'findByPk')
      .mockReturnValueOnce({ mockPost, user: mockUser });

    const mockJson = jest.fn();
    const mockReq = { params: { id: 1 } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
  
    // Act
    await controller.post.findById(mockReq, mockRes);

    // Assert
    expect(findByIdSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith({ mockPost, user: mockUser });

    findByIdSpy.mockRestore();
  });

  test('search Post', async () => {
    const searchSpy = jest
      .spyOn(Blog_post, 'findAll')
      .mockReturnValueOnce([{ mockPost, user: mockUser }]);

    const mockJson = jest.fn();
    const mockReq = { query: { q: 'upd' } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.post.search(mockReq, mockRes);

    // Assert
    expect(searchSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith([{ mockPost, user: mockUser }]);

    searchSpy.mockRestore();
  });

  test.skip('deletePost Post', async () => {
    const deleteSpy = jest
      .spyOn(Blog_post, 'destroy');

    const findOneSpy = jest
      .spyOn(Blog_post, 'findOne')
      .mockReturnValueOnce({ dataValues: { userId: 1 } });

    const mockJson = jest.fn();
    const mockReq = { params: { id: 1 }, user: { dataValues: { id: 1 } } };
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    // Act
    await controller.post.deletePost(mockReq, mockRes);

    // Assert
    expect(deleteSpy).toBeCalledTimes(1);
    expect(findOneSpy).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockJson).toBeCalledWith({ message: 'deletado com sucesso' });

    deleteSpy.mockRestore();
    findOneSpy.mockRestore();
  });
});