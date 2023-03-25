import { fromJS } from 'immutable';
import 'moment/locale/en-gb';
import moment from 'moment';
import {
  FETCH_TIMELINE,
  FETCH_TIMELINE_SUCCEEDED,
  FETCH_TIMELINE_FAILED,
  INIT_TIMELINE,
  INIT_TIMELINE_SUCCEEDED,
  INIT_TIMELINE_FAILED,
  TIMELINE_COMPLETE,
  COMPLETED,
  UPDATE_PROJECT_TIME_SUCCEEDED,
  UPDATE_COMPLETED_SUCCEEDED,
  TIMELINE_CLEAR,
} from '../constants';
import reducer from '../reducer';

describe('TimelineReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      loading: false,
      data: [],
    });
  });

  it('default', () => {
    const action = { type: undefined };
    const mockState = state;
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('INIT_TIMELINE', () => {
    const action = { type: INIT_TIMELINE };
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('FETCH_TIMELINE', () => {
    const action = { type: FETCH_TIMELINE };
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('INIT_TIMELINE_SUCCEEDED', () => {
    const data = [];
    const action = { type: INIT_TIMELINE_SUCCEEDED, payload: data };

    const mockState = state
      .set('loading', false)
      .set('data', fromJS(data));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('FETCH_TIMELINE_SUCCEEDED', () => {
    const data = [];
    const action = { type: FETCH_TIMELINE_SUCCEEDED, payload: data };

    const mockState = state
      .set('loading', false)
      .set('data', fromJS(data));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('INIT_TIMELINE_FAILED', () => {
    const action = { type: INIT_TIMELINE_FAILED };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('FETCH_TIMELINE_FAILED', () => {
    const action = { type: FETCH_TIMELINE_FAILED };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('UPDATE_PROJECT_TIME_SUCCEEDED', () => {
    const data = state.get('data').toJS();
    const action = { type: UPDATE_PROJECT_TIME_SUCCEEDED, payload: {} };
    const mockState = state
      .set('loading', false)
      .set('data', fromJS(data));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('UPDATE_COMPLETED_SUCCEEDED', () => {
    const data = state.get('data').toJS();
    const action = { type: UPDATE_COMPLETED_SUCCEEDED, payload: {} };
    const mockState = state
      .set('loading', false)
      .set('data', fromJS(data));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('TIMELINE_COMPLETE', () => {
    const action = { type: TIMELINE_COMPLETE, payload: { index: 0 } };
    const mockState = state
      .setIn(['data', 0, 'status'], COMPLETED)
      .setIn(['data', 0, 'completedDate'], moment().format('MMM DD, YYYY'));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('TIMELINE_CLEAR', () => {
    const action = { type: TIMELINE_CLEAR };
    const mockState = state;
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});
