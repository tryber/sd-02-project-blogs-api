const checkFields = require('./checkFields');

describe('Testing checkFields', () => {
  test('Test checkName', () => {
    const nameLessEight = 'Pedro';
    const nameEight = 'Pedro123';
    const nameMoreEight = 'Pedro1234';

    expect(checkFields.checkName(nameLessEight)).toBeFalsy();
    expect(checkFields.checkName(nameEight)).toBeTruthy();
    expect(checkFields.checkName(nameMoreEight)).toBeTruthy();
  });

  test('Test checkName', () => {
    const passLessSix = '12345';
    const passSix = '123456';
    const passMoreSix = '1234567';

    expect(checkFields.checkPassword(passLessSix)).toBeFalsy();
    expect(checkFields.checkPassword(passSix)).toBeTruthy();
    expect(checkFields.checkPassword(passMoreSix)).toBeFalsy();
  });

  test('Test email', () => {
    const withoutDomain = 'pedro@';
    const withoutName = '@gmail';
    const complete = 'pedro@gmail.com';

    expect(checkFields.checkEmail(withoutDomain)).toBeFalsy();
    expect(checkFields.checkEmail(withoutName)).toBeFalsy();
    expect(checkFields.checkEmail(complete)).toBeTruthy();
  });
});
