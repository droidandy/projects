import { fromJS } from 'immutable';
import homeReducer from '../reducer';
import {
  CHANGE_FORM,
  FORM_SUBMIT,
  FORM_SUBMIT_SUCCESS,
  FORM_SUBMIT_ERROR,
} from '../constants';

describe('appReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      sent: false,
      loading: false,
      form: {
        name: '',
        companyName: '',
        message: '',
        email: '',
      },
    });
  });

  it('should return the initial state', () => {
    expect(homeReducer(undefined, {})).toEqual(state);
  });

  it('CHANGE_FORM', () => {
    const mockAction = { type: CHANGE_FORM, payload: { key: 'name', value: 'test' } };
    const mockState = state.setIn(['form', 'name'], 'test');
    expect(homeReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FORM_SUBMIT', () => {
    const mockAction = { type: FORM_SUBMIT };
    const mockState = state.setIn(['loading'], true);
    expect(homeReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FORM_SUBMIT_SUCCESS', () => {
    const mockAction = { type: FORM_SUBMIT_SUCCESS };
    const mockState = state
      .setIn(['loading'], false)
      .setIn(['sent'], true);
    expect(homeReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FORM_SUBMIT_ERROR', () => {
    const mockAction = { type: FORM_SUBMIT_ERROR };
    const mockState = state
      .setIn(['loading'], false);
    expect(homeReducer(undefined, mockAction)).toEqual(mockState);
  });
});
