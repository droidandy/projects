import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as actions from '../actions';
import * as types from '../constants';

describe('BrokeragePageReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      loading: false,
      peopleLoading: false,
      listType: '',
      changedBrokerage: {},
      selectedBroker: {},
      auth0List: [],
    });
  });

  it('UPDATE_BROKERAGE', () => {
    const mockAction = actions.updateBrokerage(123, 'keytest', 'valuetest');
    const mockState = state
      .setIn(['changedBrokerage', 'id'], mockAction.payload.id)
      .setIn(['changedBrokerage', mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SELECT_BROKER', () => {
    const mockAction = actions.selectBroker({ test: 'cool' });
    const mockState = state
      .set('changedBrokerage', fromJS({}))
      .set('selectedBroker', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REVERT_CHANGES', () => {
    const mockAction = actions.revertChanges();
    const mockState = state
      .set('changedBrokerage', fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CHANGES', () => {
    const mockAction = actions.saveChanges();
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CHANGES_SUCCESS', () => {
    const mockAction = { type: types.SAVE_CHANGES_SUCCESS, payload: { test: 'test' } };
    const mockState = state
      .set('loading', false)
      .set('changedBrokerage', fromJS({}))
      .set('selectedBroker', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CHANGES_ERROR', () => {
    const mockAction = { type: types.SAVE_CHANGES_ERROR, payload: { test: 'test' } };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SET_LIST_TYPE', () => {
    const mockAction = actions.setListType('vincent123Test');
    const mockState = state
      .set('listType', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_AUTH0_LIST', () => {
    const mockAction = actions.getAuth0('test');
    const mockState = state
      .set('peopleLoading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_AUTH0_LIST_SUCCESS', () => {
    const mockAction = { type: types.GET_AUTH0_LIST_SUCCESS, payload: ['test23'] };
    const mockState = state
      .set('peopleLoading', false)
      .set('auth0List', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_AUTH0_LIST_ERROR', () => {
    const mockAction = { type: types.GET_AUTH0_LIST_ERROR };
    const mockState = state
      .set('peopleLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});
