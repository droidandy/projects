import {
  CHANGE_INFO,
  SET_USER_EULA,
  changeInfo,
  saveInfo,
  setUserEULA,
  SAVE_INFO,
} from '@benrevo/benrevo-react-core';

describe('user profile actions', () => {
  const key = { key: 'key' };
  const value = { value: 'value' };
  const check = { check: 'check' };
  it('changeInfo', () => {
    const expected = {
      type: CHANGE_INFO,
      payload: { key, value },
    };
    expect(changeInfo(key, value)).toEqual(expected);
  });
  it('setUserEULA', () => {
    const expected = {
      type: SET_USER_EULA,
      check,
    };
    expect(setUserEULA(check)).toEqual(expected);
  });
  it('saveInfo', () => {
    const expected = {
      type: SAVE_INFO,
    };
    expect(saveInfo()).toEqual(expected);
  });
});
