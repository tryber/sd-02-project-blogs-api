const mockUser = [{
  id: 1,
  password: '123456',
  displayName: 'Brett Wiltshire',
  email: 'brett@email.com',
  image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
}];

const createSpy = (func, method, value) => jest
  .spyOn(func, method)
  .mockReturnValueOnce(value);

const createSpyError = (func, method) => jest
  .spyOn(func, method)
  .mockImplementation(() => {
    throw new Error();
  });

const mockPosts = [
  {
    id: 2,
    content: 'The whole text for the blog post goes here in this key',
    title: 'Latest updates, August 1st',
    published: '2015-01-01T10:10:10.000Z',
    updated: '2015-01-01T10:10:10.000Z',
    user_id: 1,
    user: {
      id: 1,
      displayName: 'Brett Wiltshire',
      email: 'brett@email.com',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
    },
  },
  {
    id: 3,
    content: 'The whole text for the blog post goes here in this key',
    title: 'Latest updates, August 2st',
    published: '2020-08-15T23:47:55.000Z',
    updated: '2020-08-16T02:08:19.000Z',
    user_id: 2,
    user: {
      id: 2,
      displayName: 'Pedro Henrique',
      email: 'pedro@gmail.com',
      image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/pedro.png',
    },
  },
];

const allUsersMock = [
  {
    id: 1,
    displayName: 'Brett Wiltshire',
    email: 'brett@email.com',
    image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
  },
  {
    id: 2,
    displayName: 'Pedro Henrique',
    email: 'pedro@gmail.com',
    image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/pedro.png',
  },
];

module.exports = {
  mockUser,
  mockPosts,
  allUsersMock,
  createSpy,
  createSpyError,
};
