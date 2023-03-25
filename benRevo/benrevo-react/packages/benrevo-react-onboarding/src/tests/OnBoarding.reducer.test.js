import { fromJS, Map } from 'immutable';
import configureStore from 'redux-mock-store';
import reducer, { initialState as initialOnBoardingMasterState } from './../reducer';
import * as actions from '../actions';
import {
  ANSWERS_GET_SUCCESS,
  ANSWERS_GET_ERROR,
  ANSWERS_SAVE_SUCCESS,
  ANSWERS_SAVE_ERROR,
  FILE_QUESTIONNAIRE_SUCCESS,
  FILE_QUESTIONNAIRE_ERROR,
  ANSWERS_SEND_MAIL_ERROR,
} from '../constants';

describe('teamPageReducer', () => {
  let state;
  let store;
  const middlewares = [];
  const mockStore = configureStore(middlewares);

  beforeAll(() => {
    const initialState = fromJS({
      onBoarding: initialOnBoardingMasterState,
    });
    store = mockStore(initialState);
    state = store.getState().get('onBoarding');
  });

  it('CHANGE_VALUE 1', () => {
    const key = 0;
    const value = '123';
    const values = undefined;
    const action = actions.changeValue(key, value, values);
    const mockState = state
      .setIn(['answers', key, 'value'], value);
    expect(reducer(undefined, action)).toEqual(mockState);
  });
  it('CHANGE_VALUE 2', () => {
    const key = 0;
    const value = undefined;
    const values = [];
    const action = actions.changeValue(key, value, values);
    const mockState = state
      .deleteIn(['answers', key, 'values']);
    expect(reducer(undefined, action)).toEqual(mockState);
  });
  it('CHANGE_VALUE 3', () => {
    const key = 0;
    const value = undefined;
    const values = [{}, {}];
    const action = actions.changeValue(key, value, values);
    const mockState = state
      .setIn(['answers', key, 'values'], fromJS(values));
    expect(reducer(undefined, action)).toEqual(mockState);
  });
  it('CHANGE_VALUE 4', () => {
    const key = 0;
    const value = undefined;
    const values = undefined;
    const action = actions.changeValue(key, value, values);
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('DELETE_KEY', () => {
    const key = 0;
    const action = actions.deleteKey(key);
    const mockState = state
      .deleteIn(['answers', key])
      .deleteIn(['errors', key]);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_SHOW_DISCLOSURE', () => {
    const show = true;
    const action = actions.changeShowDisclosure(show);
    const mockState = state
      .set('showDisclosure', show);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ANSWERS_GET', () => {
    const action = actions.getAnswers();
    const mockState = state
      .set('errors', Map({}))
      .set('sent', false)
      .set('answers', Map({}))
      .set('requestError', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ANSWERS_GET_SUCCESS', () => {
    const data = { answers: [], multiAnswers: [] };
    const finalAnswers = {};
    let answers = state.get('answers');
    let count = 0;
    Object.keys(data.answers).map((key) => {
      if (key.indexOf('indicate_whether_employee_dependent') >= 0) count += 1;

      return true;
    });
    if (!count) count = 1;
    answers = answers.merge(finalAnswers);
    const mockState = state
      .set('loading', false)
      .set('submittedDate', data.submittedDate)
      .set('answers', answers)
      .setIn(['answers', 'disclosure_persons', 'value'], count);
    expect(reducer(undefined, { type: ANSWERS_GET_SUCCESS, payload: { answers: { disclosure_persons: { value: 1 } }, multiAnswers: [] } })).toEqual(mockState);
  });

  it('ANSWERS_GET_ERROR', () => {
    const action = { type: ANSWERS_GET_ERROR, payload: '' };
    const mockState = state
      .set('loading', false)
      .set('requestError', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ANSWERS_SAVE', () => {
    const action = actions.saveAnswers({});
    const mockState = state
      .set('loading', true)
      .set('requestError', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ANSWERS_SAVE_SUCCESS', () => {
    const result = {};
    const page = {};
    const action = { type: ANSWERS_SAVE_SUCCESS, payload: { result, loading: false, sent: page !== undefined } };
    const mockState = state
      .set('loading', false)
      .set('sent', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ANSWERS_SAVE_ERROR', () => {
    const error = {};
    const action = { type: ANSWERS_SAVE_ERROR, payload: { error } };
    const mockState = state
      .set('loading', false)
      .set('requestError', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('FILE_QUESTIONNAIRE', () => {
    const action = actions.getQuestionnaire({});
    const mockState = state
      .set('loading', true)
      .set('requestError', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('FILE_QUESTIONNAIRE_SUCCESS', () => {
    const action = { type: FILE_QUESTIONNAIRE_SUCCESS };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('FILE_QUESTIONNAIRE_ERROR', () => {
    const error = '';
    const action = { type: FILE_QUESTIONNAIRE_ERROR, payload: error };
    const mockState = state
      .set('loading', false)
      .set('requestError', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ANSWERS_SEND_MAIL_ERROR', () => {
    const error = '';
    const action = { type: ANSWERS_SEND_MAIL_ERROR, payload: error };
    const mockState = state
      .set('requestError', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SET_ERROR', () => {
    const key = 0;
    const message = '';
    const action = actions.setError(key, message);
    const mockState = state
      .setIn(['errors', key], { msg: message });
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('DELETE_ERROR', () => {
    const key = 0;
    const action = actions.deleteError(key);
    const mockState = state
      .deleteIn(['errors', key]);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_SHOW_ERRORS', () => {
    const value = 0;
    const action = actions.changeShowErrors(value);
    const mockState = state
      .setIn(['showErrors'], value);
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});
