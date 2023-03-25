import { fromJS, Map } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';

describe('teamPageReducer', () => {
  let state;

  beforeEach(() => {
    state = fromJS({
      hasError: false,
      loading: false,
      members: [],
      selected: [],
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  describe('UPDATE_TEAM', () => {
    it('fullName exists', () => {
      const mockAction = { type: types.UPDATE_TEAM, payload: { member: Map({ fullName: 'test' }) } };
      const mockState = state
        .setIn(['selected'], fromJS([Map({ fullName: 'test' })]));
      expect(reducer(undefined, mockAction)).toEqual(mockState);
    });
  });

  it('FETCH_TEAM_MEMBERS', () => {
    const mockAction = { type: types.FETCH_TEAM_MEMBERS };
    const mockState = state
      .setIn(['loading'], true)
      .setIn(['members'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FETCH_TEAM_FAILED', () => {
    const mockAction = { type: types.FETCH_TEAM_FAILED };
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_TEAM_FAILED', () => {
    const mockAction = { type: types.SAVE_TEAM_FAILED };
    const mockState = state
      .setIn(['loading'], false)
      .setIn(['hasError'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FETCH_TEAM_SUCCEEDED', () => {
    const mockAction = { type: types.FETCH_TEAM_SUCCEEDED, payload: { finalUsers: [], selected: [] } };
    const mockState = state
      .setIn(['loading'], false)
      .setIn(['hasError'], false)
      .set('members', fromJS([]))
      .set('selected', fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_TEAM_MEMBERS', () => {
    const mockAction = { type: types.SAVE_TEAM_MEMBERS };
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_TEAM_SUCCEEDED', () => {
    const mockAction = { type: types.SAVE_TEAM_SUCCEEDED };
    const mockState = state
      .set('loading', false)
      .set('hasError', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DELETE_TEAM_SUCCEEDED', () => {
    const mockAction = { type: types.DELETE_TEAM_SUCCEEDED };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DELETE_TEAM_FAILED', () => {
    const mockAction = { type: types.DELETE_TEAM_FAILED };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});
