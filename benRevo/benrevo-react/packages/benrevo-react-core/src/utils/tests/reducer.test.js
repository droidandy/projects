import { fromJS, Set } from 'immutable';
import {
  SET_PROFILE,
  LOGOUT,
  ERROR_EXPIRED,
  CHANGE_INFO,
  SET_USER_EULA,
  GET_USER_STATUS_SUCCESS,
  GET_USER_STATUS,
  GET_USER_STATUS_ERROR,
  CHANGE_USER_COUNT,
  CHECK_USER_GA_SUCCESS,
  CHECK_USER_GA,
  CHECK_USER_GA_ERROR,
  CHANGE_ATTRIBUTE,
} from '../authService/constants';
import * as reducer from '../authService/reducer';

describe('authReducer', () => {
  const authReducer = reducer.default;
  let state;

  beforeAll(() => {
    state = fromJS({
      lastName: '',
      firstName: '',
      loginCount: null,
      loginCountLoading: true,
      isGALoading: true,
      expired: null,
      userMetadata: {},
      userEULA: false,
      isGA: false,
      brokerages: [],
      brokerageRole: ['user'],
      attributes: null,
    });
  });

  it('default', () => {
    const action = { type: undefined };
    const mockState = state;
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('SET_PROFILE', () => {
    const action = {
      type: SET_PROFILE,
      profile: {
        firstName: 'test1',
        lastName: 'test2',
        name: 'test3',
        picture: 'test4',
        brokerageLogo: 'test5',
        brokerageRole: fromJS(['user']),
      },
    };
    const mockState = state
      .set(reducer.FIRST_NAME, action.profile.firstName)
      .set(reducer.LAST_NAME, action.profile.lastName)
      .set(reducer.NAME, action.profile.name)
      .set(reducer.EMAIL, action.profile.email)
      .set(reducer.PICTURE, action.profile.picture)
      .set(reducer.BROKERAGE, action.profile.brokerage)
      .set(reducer.BROKERAGE_LOGO, action.profile.brokerageLogo)
      .set(reducer.BROKERAGE_ROLE, action.profile.brokerageRole)
      .set(reducer.EXPIRED, false);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_INFO', () => {
    const action = {
      type: CHANGE_INFO,
      payload: {
        key: 'test1',
        value: 'test2',
      },
    };
    const mockState = state
      .setIn([action.payload.key], action.payload.value);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('SET_USER_EULA', () => {
    const action = {
      type: SET_USER_EULA,
      check: 'test',
    };
    const mockState = state
      .set('userEULA', action.check);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('LOGOUT', () => {
    const action = { type: LOGOUT };
    const mockState = state
      .clear();
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('ERROR_EXPIRED', () => {
    const action = { type: ERROR_EXPIRED, payload: 'test' };
    const mockState = state
      .set(reducer.EXPIRED, action.payload);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('GET_USER_STATUS', () => {
    const action = { type: GET_USER_STATUS };
    const mockState = state
      .set(reducer.LOGIN_COUNT_LOADING, true);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('GET_USER_STATUS_SUCCESS', () => {
    const action = { type: GET_USER_STATUS_SUCCESS, payload: { loginCount: 1, attributes: [] } };
    const mockState = state
      .set(reducer.LOGIN_COUNT, action.payload.loginCount)
      .set(reducer.ATTRIBUTES, Set(action.payload.attributes))
      .set(reducer.LOGIN_COUNT_LOADING, false);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('GET_USER_STATUS_ERROR', () => {
    const action = { type: GET_USER_STATUS_ERROR };
    const mockState = state
      .set(reducer.LOGIN_COUNT_LOADING, false);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_USER_COUNT', () => {
    const action = { type: CHANGE_USER_COUNT };
    const mockState = state
      .set(reducer.LOGIN_COUNT, 2);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_USER_GA', () => {
    const action = { type: CHECK_USER_GA };
    const mockState = state
      .set(reducer.IS_GA_LOADING, true);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_USER_GA_SUCCESS', () => {
    const action = { type: CHECK_USER_GA_SUCCESS, payload: { check: 'test1', brokerage: 'test2' } };
    const mockState = state
      .set(reducer.IS_GA, action.payload.check)
      .set(reducer.IS_GA_LOADING, false)
      .set(reducer.GA_BROKERAGES, fromJS(action.payload.brokerages));
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_USER_GA_ERROR', () => {
    const action = { type: CHECK_USER_GA_ERROR };
    const mockState = state
      .set(reducer.IS_GA_LOADING, false);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_ATTRIBUTE', () => {
    const action = { type: CHANGE_ATTRIBUTE, payload: {} };
    let attributes = Set(state.get(reducer.ATTRIBUTES));
    attributes = attributes.add(action.payload);
    const mockState = state
      .set(reducer.ATTRIBUTES, attributes);
    expect(authReducer(undefined, action)).toEqual(mockState);
  });
});
