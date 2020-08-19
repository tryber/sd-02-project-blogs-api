const checkFields = require('./checkFields');

describe('Testing checkFields', () => {
  test('Test checkName', () => {
    const nameLessEight = 'Pedro';
    const nameEight = 'Pedro123';
    const nameMoreEight = 'Pedro1234';

    expect(checkFields.nameOk(nameLessEight)).toBeFalsy();
    expect(checkFields.nameOk(nameEight)).toBeTruthy();
    expect(checkFields.nameOk(nameMoreEight)).toBeTruthy();
  });

  test('Test checkName', () => {
    const passLessSix = '12345';
    const passSix = '123456';
    const passMoreSix = '1234567';

    expect(checkFields.passOk(passLessSix)).toBeFalsy();
    expect(checkFields.passOk(passSix)).toBeTruthy();
    expect(checkFields.passOk(passMoreSix)).toBeFalsy();
  });

  test('Test email', () => {
    const withoutDomain = 'pedro@';
    const withoutName = '@gmail';
    const complete = 'pedro@gmail.com';

    expect(checkFields.emailOk(withoutDomain)).toBeFalsy();
    expect(checkFields.emailOk(withoutName)).toBeFalsy();
    expect(checkFields.emailOk(complete)).toBeTruthy();
  });
});
