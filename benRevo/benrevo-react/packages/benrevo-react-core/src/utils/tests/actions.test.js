import {
  SET_PROFILE,
  LOGOUT,
  ERROR_EXPIRED,
  GET_USER_STATUS,
  CHANGE_USER_COUNT,
  CHECK_USER_GA,
  CHANGE_ATTRIBUTE,
  SEND_FEEDBACK,
} from '../authService/constants';
import {
  setProfile,
  logout,
  setExpired,
  getUserCount,
  checkUserGA,
  changeUserCount,
  changeAttribute,
  sendFeedback,
} from '../authService/actions';

describe('authService actions', () => {
  it('setProfile', () => {
    const expected = {
      type: SET_PROFILE,
      profile: 'test',
    };
    expect(setProfile('test')).toEqual(expected);
  });

  it('logout', () => {
    const expected = {
      type: LOGOUT,
    };
    expect(logout()).toEqual(expected);
  });

  it('setExpired', () => {
    const expected = {
      type: ERROR_EXPIRED,
      payload: 'test',
    };
    expect(setExpired('test')).toEqual(expected);
  });

  it('getUserCount', () => {
    const expected = {
      type: GET_USER_STATUS,
    };
    expect(getUserCount()).toEqual(expected);
  });

  it('checkUserGA', () => {
    const expected = {
      type: CHECK_USER_GA,
    };
    expect(checkUserGA()).toEqual(expected);
  });

  it('changeUserCount', () => {
    const expected = {
      type: CHANGE_USER_COUNT,
    };
    expect(changeUserCount()).toEqual(expected);
  });

  it('changeAttribute', () => {
    const expected = {
      type: CHANGE_ATTRIBUTE,
      payload: 'test',
    };
    expect(changeAttribute('test')).toEqual(expected);
  });

  it('sendFeedback', () => {
    const expected = {
      type: SEND_FEEDBACK,
      payload: { page: 'test1', text: 'test2', feedbackType: 'test3', metadata: 'test4' },
    };
    expect(sendFeedback('test1', 'test2', 'test3', 'test4')).toEqual(expected);
  });
});
