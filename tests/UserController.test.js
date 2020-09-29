const searchUser = require('../services/searchUser');
const services = require('../services');

jest.mock('../services/searchUser');

describe('Test user Route', () => {
  test('Failed create request', async () => {
    jest
      .spyOn(searchUser, 'searchUser')
      .mockReturnValueOnce({
        displayName: 'Marcos Mion',
        email: 'marcos@mion.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      });

    const mockReq = {
      body: {
        displayName: 'Marcos Mion',
        email: 'marcos@mion.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      },
    };

    const mockRes = {
      status: jest
        .fn()
        .mockReturnValueOnce({
          json: jest.fn(),
        }),
    };

    const userLoginReturns = await services.userLogin(mockReq, mockRes);
    console.log(userLoginReturns);
  });
});
