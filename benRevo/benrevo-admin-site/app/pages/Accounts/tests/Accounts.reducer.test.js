import { browserHistory } from 'react-router';
import { fromJS } from 'immutable';
import configureStore from '../../../store';
import reducer from '../reducer';
import * as actions from '../actions';

describe('teamPageReducer', () => {
  let store;
  let state;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
    state = store.getState().get('accountsPage');
  });

  it('CHANGE_FIELD', () => {
    const mockAction = actions.changeField('123', '234');
    const mockState = state
      .setIn([mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('REQUESTS_GET', () => {
    const mockAction = actions.requestsGet();
    const mockState = state
      .setIn(['requests'], fromJS([]))
      .setIn(['loading'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('REQUESTS_GET_SUCCESS', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['loading'], false)
      .setIn(['requests'], fromJS(mockAction.payload.reverse()));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('REQUESTS_GET_ERROR', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('GA_GET', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['ga'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('GA_GETS_SUCCESS', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['ga'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('CONTACTS_GET', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['presales'], fromJS([]))
      .setIn(['sales'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('CONTACTS_GET_SUCCESS', () => {
    const mockAction = { payload: { presales: [], sales: [] } };
    const mockState = state
      .setIn(['presales'], fromJS(mockAction.payload.presales))
      .setIn(['sales'], fromJS(mockAction.payload.sales));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('BROKERAGE_GET', () => {
    const mockAction = { payload: {} };
    const mockState = state
      .setIn(['brokerages'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('BROKERAGE_GETS_SUCCESS', () => {
    const mockAction = { payload: [] };
    const mockState = state
      .setIn(['brokerages'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('SELECT_REQUEST', () => {
    const mockAction = actions.selectRequest({ brokerId: '123', gaId: '234', bcc: '' });
    const item = mockAction.payload;
    let selectedBrokerage = null;
    let selectedGA = null;
    let isExistingGA = false;
    let isExistingBrokerage = false;

    if (item.brokerId) {
      selectedBrokerage = item.brokerId;
      isExistingBrokerage = true;
    }

    if (item.gaId) {
      selectedGA = item.gaId;
      isExistingGA = true;
    }
    const mockState = state
      .setIn(['denyReason'], '')
      .setIn(['isExistingGA'], isExistingGA)
      .setIn(['isExistingBrokerage'], isExistingBrokerage)
      .setIn(['selectedGA'], selectedGA)
      .setIn(['selectedBrokerage'], selectedBrokerage)
      .setIn(['currentOriginal'], fromJS(mockAction.payload))
      .setIn(['current'], fromJS(mockAction.payload))
      .setIn(['bccEmail'], mockAction.payload.bcc);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('CHANGE_INFO', () => {
    const mockAction = actions.changeInfo('123', '234');
    const mockState = state
      .setIn(['current', mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('CANCEL_CHANGE_INFO', () => {
    const mockAction = actions.cancelChangeInfo();
    const mockState = state
      .setIn(['current'], state.get('currentOriginal'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('SAVE_INFO', () => {
    const mockAction = actions.saveInfo();
    const mockState = state
      .setIn(['currentOriginal'], state.get('current'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('APPROVE', () => {
    const mockAction = actions.approve();
    const mockState = state
      .setIn(['loading'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('APPROVE_SUCCESS', () => {
    const mockAction = {};
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('APPROVE_ERROR', () => {
    const mockAction = {};
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('SET_ERROR', () => {
    const mockAction = actions.setRouteError('123');
    const mockState = state
      .setIn(['routeError'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('UPDATE_BCC', () => {
    const mockAction = actions.updateBCC('test');
    const mockState = state
      .setIn(['bccEmail'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});
