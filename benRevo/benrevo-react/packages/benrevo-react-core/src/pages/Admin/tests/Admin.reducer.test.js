import { fromJS } from 'immutable';
import moment from 'moment';
import contactReducer from '../reducer';
import {
  DISCLOSURE_CANCEL,
  CHANGE_DISCLOSURE,
  DISCLOSURE_SUBMIT,
  DISCLOSURE_SUBMIT_SUCCESS,
  DISCLOSURE_SUBMIT_ERROR,
  GET_CONFIG,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_ERROR,
} from './../constants';

describe('appReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: false,
      configLoaded: false,
      disclosureOrigin: {
        data: '',
        modifyBy: '',
        modifyDate: '',
        type: 'LANGUAGE',
      },
      disclosure: {
        data: '',
        modifyBy: '',
        modifyDate: '',
        type: 'LANGUAGE',
      },
    });
  });

  it('should return the initial state', () => {
    expect(contactReducer(undefined, {})).toEqual(state);
  });

  it('CHANGE_DISCLOSURE', () => {
    const mockAction = { type: CHANGE_DISCLOSURE, payload: { value: 'test' } };
    const mockState = state
      .setIn(['disclosure', 'data'], 'test');
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DISCLOSURE_CANCEL', () => {
    const mockAction = { type: DISCLOSURE_CANCEL };
    const mockState = state
      .setIn(['disclosure', 'data'], state.get('disclosureOrigin').get('data'));
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DISCLOSURE_SUBMIT', () => {
    const mockAction = { type: DISCLOSURE_SUBMIT };
    const mockState = state
      .setIn(['disclosure', 'modifyDate'], moment().format())
      .setIn(['loading'], false);
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DISCLOSURE_SUBMIT_SUCCESS', () => {
    const mockAction = { type: DISCLOSURE_SUBMIT_SUCCESS };
    const mockState = state
      .setIn(['loading'], false);
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DISCLOSURE_SUBMIT_ERROR', () => {
    const mockAction = { type: DISCLOSURE_SUBMIT_ERROR };
    const mockState = state
      .setIn(['loading'], false);
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CONFIG', () => {
    const mockAction = { type: GET_CONFIG };
    const mockState = state
      .setIn(['configLoaded'], false)
      .setIn(['loading'], true);
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CONFIG_SUCCESS 1', () => {
    const mockAction = { type: GET_CONFIG_SUCCESS, payload: [] };
    const mockState = state
      .setIn(['disclosureOrigin'], (mockAction.payload.length) ? fromJS(mockAction.payload[0]) : state.get('disclosureOrigin'))
      .setIn(['disclosure'], (mockAction.payload.length) ? fromJS(mockAction.payload[0]) : state.get('disclosure'))
      .setIn(['configLoaded'], true)
      .setIn(['loading'], false);
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CONFIG_SUCCESS 2', () => {
    const mockAction = { type: GET_CONFIG_SUCCESS, payload: ['test'] };
    const mockState = state
      .setIn(['disclosureOrigin'], (mockAction.payload.length) ? fromJS(mockAction.payload[0]) : state.get('disclosureOrigin'))
      .setIn(['disclosure'], (mockAction.payload.length) ? fromJS(mockAction.payload[0]) : state.get('disclosure'))
      .setIn(['configLoaded'], true)
      .setIn(['loading'], false);
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CONFIG_ERROR', () => {
    const mockAction = { type: GET_CONFIG_ERROR };
    const mockState = state
      .setIn(['configLoaded'], true)
      .setIn(['loading'], false);
    expect(contactReducer(undefined, mockAction)).toEqual(mockState);
  });
});
