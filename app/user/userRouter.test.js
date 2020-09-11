const request = require('supertest');

const faker = require('faker');

const app = require('../../main');

afterEach(() => {
  jest.clearAllMocks();
});

describe('User Router', () => {
  let mockToken, mockId;

  const mockEmail = faker.internet.email();

  const mockPassword = faker.internet.password(10);

  const mockName = faker.name.findName();

  const mockNewName = faker.name.findName();

  describe('Post /user', () => {
    it('on succes - create user', async () => {
      const mockDataSent = {
        email: mockEmail,
        password: mockPassword,
        displayName: mockName,
      };

      const response = await request.agent(app).post('/user').send(mockDataSent);

      mockId = response.body.user.id;

      expect(response.error).toBeFalsy();

      expect(response.status).toBe(201);

      expect(response.body.token).toBeTruthy();

      expect(response.body.user.id).toBeTruthy();

      expect(response.body.user.displayName).toBe(mockDataSent.displayName);

      expect(response.body.user.email).toBe(mockDataSent.email);

      expect(response.body.user.password).toBeFalsy();
    });

    it('on failure - invalid data', async () => {
      const mockDataSent = {
        email: 'email',
        password: 'pass',
        displayName: 1,
      };

      const mockError = {
        error: {
          details: [
            'email must be in a format <name>@<domain>',
            'displayName must be a type of string',
            'password length must be at least 6 characters long',
          ],
          message: 'Invalid Data',
        },
      };

      const response = await request.agent(app).post('/user').send(mockDataSent);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('POST /user/login', () => {
    it('on success', async () => {
      const mockUserLogin = {
        password: mockPassword,
        email: mockEmail,
      };

      const mockUser = {
        id: mockId,
        displayName: mockName,
        email: mockEmail,
        image: null,
      };

      const response = await request.agent(app).post('/user/login').send(mockUserLogin);

      mockToken = response.body.token;

      expect(response.status).toBe(200);

      expect(response.body.token).toBeTruthy();

      expect(response.body.user).toStrictEqual(mockUser);
    });

    it('on faliure - invalid data', async () => {
      const mockUserLogin = {
        password: '123',
        email: faker.name.firstName(),
      };

      const mockError = {
        error: {
          message: 'Invalid Data',
          details: [
            'email must be in a format <name>@<domain>',
            'password length must be at least 6 characters long',
          ],
        },
      };

      const response = await request.agent(app).post('/user/login').send(mockUserLogin);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on faliure - user not exists', async () => {
      const mockUserLogin = {
        password: faker.lorem.words(10),
        email: faker.internet.email(),
      };

      const mockError = {
        error: {
          details: null,
          message: 'Usuário não encontrado',
        },
      };

      const response = await request.agent(app).post('/user/login').send(mockUserLogin);

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Get /user', () => {
    it('on succes - list users', async () => {
      const mockUser = {
        id: 1,
        displayName: 'Brett Wiltshire',
        email: 'brett@email.com',
        image:
          'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      };

      const response = await request.agent(app).get('/user').set('Authorization', mockToken);

      expect(response.status).toBe(200);

      expect(JSON.parse(response.text).users[0]).toStrictEqual(mockUser);
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request.agent(app).get('/user');

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Patch  /user/id', () => {
    it('on succes', async () => {
      const mockUser = {
        id: mockId,
        displayName: mockNewName,
        email: mockEmail,
        image: null,
      };

      const response = await request
        .agent(app)
        .patch(`/user/${mockId}`)
        .set('Authorization', mockToken)
        .send({ displayName: mockNewName });
      expect(response.status).toBe(200);

      expect(JSON.parse(response.text)).toStrictEqual({ user: mockUser });
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request
        .agent(app)
        .patch(`/user/${mockId}`)
        .send({ displayName: mockNewName });

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on failure - user not found', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Usuário não encontrado',
        },
      };

      const response = await request
        .agent(app)
        .patch(`/user/:fakeId`)
        .set('Authorization', mockToken)
        .send({ displayName: mockNewName });

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Get  /user/id', () => {
    it('on succes - find user', async () => {
      const mockUser = {
        id: mockId,
        displayName: mockNewName,
        email: mockEmail,
        image: null,
      };

      const response = await request
        .agent(app)
        .get(`/user/${mockId}`)
        .set('Authorization', mockToken);

      expect(response.status).toBe(200);

      expect(JSON.parse(response.text)).toStrictEqual({ user: mockUser });
    });

    it('on failure - no authentication', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Token not found',
        },
      };

      const response = await request
        .agent(app)
        .get(`/user/${mockId}`)
        .send({ displayName: mockNewName });

      expect(response.status).toBe(401);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });

    it('on failure - user not found', async () => {
      const mockError = {
        error: {
          details: null,
          message: 'Usuário não encontrado',
        },
      };

      const response = await request
        .agent(app)
        .get('/user/:fakeId')
        .set('Authorization', mockToken)
        .send({ displayName: mockNewName });

      expect(response.status).toBe(400);

      expect(JSON.parse(response.text)).toStrictEqual(mockError);
    });
  });

  describe('Delete  /user/id', () => {
    it('on succes', async () => {
      const response = await request
        .agent(app)
        .delete(`/user/${mockId}`)
        .set('Authorization', mockToken)
        .send({ displayName: mockNewName });

      expect(response.status).toBe(204);
    });
  });

  describe('Patch  /user/id/image', () => {
    it('on succes', async () => {});
  });
});
