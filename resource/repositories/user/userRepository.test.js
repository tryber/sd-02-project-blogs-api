const userRepository = require('./userRepository');

const faker = require('faker');

describe('User Repository', () => {
  it('Create User', async () => {
    const mockDataUserSent = {
      id: faker.random.number(),
      email: faker.internet.email(),
      displayName: faker.name.findName(),
      password: faker.random.hexaDecimal(),
    };

    const mockDataUserReceived = {
      dataValues: {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        displayName: mockDataUserSent.displayName,
        password: mockDataUserSent.password,
      },
    };

    const mockCreate = jest.fn().mockResolvedValue(mockDataUserReceived);

    const mockModels = {
      Users: {
        create: mockCreate,
      },
    };

    const repository = new userRepository({ models: mockModels, data: mockDataUserSent });

    const data = await repository.create();

    expect(mockCreate).toHaveBeenCalledTimes(1);

    expect(data).toStrictEqual(mockDataUserReceived);
  });

  it('Find User', async () => {
    const mockDataUserSent = {
      id: faker.random.number(),
    };

    const mockDataUserReceived = {
      dataValues: {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        displayName: mockDataUserSent.displayName,
        password: mockDataUserSent.password,
      },
    };

    const mockFindByPk = jest.fn().mockResolvedValue(mockDataUserReceived);

    const mockModels = {
      Users: {
        findByPk: mockFindByPk,
      },
    };

    const repository = new userRepository({ models: mockModels, data: mockDataUserSent });

    const data = await repository.find();

    expect(mockFindByPk).toHaveBeenCalledTimes(1);

    expect(mockFindByPk).toHaveBeenCalledWith(mockDataUserSent.id);

    expect(data).toStrictEqual(mockDataUserReceived);
  });

  it('Find User By Email', async () => {
    const mockDataUserSent = {
      id: faker.random.number(),
    };

    const mockDataUserReceived = {
      dataValues: {
        id: faker.random.number(),
        email: mockDataUserSent.email,
        displayName: mockDataUserSent.displayName,
        password: mockDataUserSent.password,
      },
    };

    const mockFindAll = jest.fn().mockResolvedValue(mockDataUserReceived);

    const mockModels = {
      Users: {
        findAll: mockFindAll,
      },
    };

    const repository = new userRepository({ models: mockModels, data: mockDataUserSent });

    const data = await repository.findBy('email');

    expect(mockFindAll).toHaveBeenCalledTimes(1);

    expect(data).toStrictEqual(mockDataUserReceived);
  });

  it('List User', async () => {
    const createUser = () => ({
      dataValues: {
        id: faker.random.number(),
        email: faker.internet.email(),
        displayName: faker.name.findName(),
        image: faker.internet.url(),
        password: faker.internet.password(),
      },
    });

    const mockDataUsersReceived = new Array(10).fill(undefined).map(createUser);

    const mockFindAll = jest.fn().mockResolvedValue(mockDataUsersReceived);

    const mockModels = {
      Users: {
        findAll: mockFindAll,
      },
    };

    const repository = new userRepository({ models: mockModels, data: null });

    const data = await repository.list();

    expect(mockFindAll).toHaveBeenCalledTimes(1);

    expect(data).toStrictEqual(mockDataUsersReceived);
  });

  it('Remove User', async () => {
    const mockDataUserSent = {
      id: faker.random.number(),
    };

    const mockDestroy = jest.fn();

    const mockModels = {
      Users: {
        destroy: mockDestroy,
      },
    };

    const repository = new userRepository({ models: mockModels, data: mockDataUserSent });

    await repository.remove();

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('Update User', async () => {
    const mockDataUserSent = {
      id: faker.random.number(),
    };

    const mockUpdate = jest.fn();

    const mockModels = {
      Users: {
        update: mockUpdate,
      },
    };

    const repository = new userRepository({ models: mockModels, data: mockDataUserSent });

    await repository.update();

    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
});
