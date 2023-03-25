import { fromJS } from 'immutable';
import {
  HomeReducer,
  CHANGE_FORM,
  FORM_SUBMIT,
  FORM_SUBMIT_SUCCESS,
  FORM_SUBMIT_ERROR,
} from '@benrevo/benrevo-react-core';

describe('HomeReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      sent: false,
      loading: false,
      form: {
        firstName: '',
        lastName: '',
        brokerageFirmName: '',
        brokerageFirmZipCode: '',
        email: '',
      },
    });
  });

  it('should return the initial state', () => {
    expect(HomeReducer(undefined, {})).toEqual(state);
  });

  it('should return the username', () => {
    const mockAction = { type: CHANGE_FORM, payload: { key: 'firstName', value: 'test' } };
    const mockState = state.setIn(['form', 'firstName'], 'test');
    expect(HomeReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FORM_SUBMIT', () => {
    const mockAction = { type: FORM_SUBMIT };
    const mockState = state
      .setIn(['loading'], true);
    expect(HomeReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FORM_SUBMIT_SUCCESS', () => {
    const mockAction = { type: FORM_SUBMIT_SUCCESS };
    const mockState = state
      .setIn(['loading'], false)
      .setIn(['form'], state.get('form'))
      .setIn(['sent'], true);
    expect(HomeReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FORM_SUBMIT_ERROR', () => {
    const mockAction = { type: FORM_SUBMIT_ERROR };
    const mockState = state
      .setIn(['loading'], false);
    expect(HomeReducer(undefined, mockAction)).toEqual(mockState);
  });
});
