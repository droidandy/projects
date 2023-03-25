import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';
import * as appTypes from '../../../App/constants';

describe('BrokeragePageReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      loading: false,
      current: {},
      currentActivity: {},
      sort: {
        prop: 'created',
        order: 'descending',
      },
      activities: [],
      optionsProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
      competitiveInfoOptions: [],
      optionDetails: {},
      optionRiders: {},
      accessStatus: types.ACCESS_STATUS_STOP,
      historyNotes: '',
      historyEdits: '',
      historyEditMode: false,
      historySaveLoading: false,
    });
  });

  it('CHANGE_OPTIONS_PRODUCT', () => {
    const mockAction = { type: types.CHANGE_OPTIONS_PRODUCT, payload: { product: 'test' } };
    const mockState = state
      .set('loading', true)
      .setIn(['optionsProduct'], mockAction.payload.product);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_ACTIVITY', () => {
    const mockAction = { type: types.CHANGE_ACTIVITY, payload: { key: 'hi', value: 'test' } };
    const mockState = state
      .setIn(['currentActivity', mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_ACCESS_STATUS', () => {
    const mockAction = { type: types.CHANGE_ACCESS_STATUS, payload: 'test123' };
    const mockState = state
      .setIn(['accessStatus'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_ACTIVITY_SORT', () => {
    const mockAction = { type: types.CHANGE_ACTIVITY_SORT, payload: { prop: 'test' } };
    const prop = mockAction.payload.prop;
    let sort = state.get('sort');
    sort = sort.set('prop', prop).set('order', 'ascending');
    const mockState = state
      .setIn(['sort'], sort);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_GET', () => {
    const mockAction = { type: types.CLIENT_GET, payload: { notClear: false } };
    const mockState = state
      .setIn(['current'], (!mockAction.payload.notClear) ? fromJS({}) : state.get('current'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENT_GET_SUCCESS', () => {
    const mockAction = { type: types.CLIENT_GET_SUCCESS, payload: { testData: 'testdata123' } };
    const mockState = state
      .set('historyEditMode', state.get('historyEditMode'))
      .setIn(['current'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('OPTION_GET', () => {
    const mockAction = { type: types.OPTION_GET };
    const mockState = state
      .setIn(['optionDetails'], fromJS({}))
      .setIn(['optionRiders'], fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('OPTION_GET_SUCCESS', () => {
    const mockAction = { type: types.OPTION_GET_SUCCESS, payload: { option: 'boo', riders: 'bam' } };
    const mockState = state
      .setIn(['optionDetails'], fromJS(mockAction.payload.option))
      .setIn(['optionRiders'], fromJS(mockAction.payload.riders));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ACTIVITIES_GET', () => {
    const mockAction = { type: types.ACTIVITIES_GET };
    const mockState = state;
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ACTIVITIES_GET_SUCCESS', () => {
    const mockAction = { type: types.ACTIVITIES_GET_SUCCESS, payload: 'BestTest123' };
    const mockState = state
      .setIn(['activities'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ACTIVITY_UPDATE', () => {
    const mockAction = { type: types.ACTIVITY_UPDATE, payload: { id: 123 } };
    let activities = state.get('activities');
    const id = mockAction.payload.id;

    activities.map((item, i) => {
      if (item.get('activityId') === id) {
        activities = activities.set(i, item.merge(state.get('currentActivity')));
      }

      return true;
    });

    const mockState = state
      .setIn(['activities'], activities);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ACTIVITY_CREATE_SUCCESS', () => {
    const mockAction = { type: types.ACTIVITY_CREATE_SUCCESS };
    const mockState = state
      .setIn(['currentActivity'], fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ACTIVITY_GET', () => {
    const mockAction = { type: types.ACTIVITY_GET };
    const mockState = state
      .setIn(['currentActivity'], fromJS({ notes: '' }));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ACTIVITY_GET_SUCCESS', () => {
    const mockAction = { type: types.ACTIVITY_GET_SUCCESS, payload: { data: 'test' } };
    const mockState = state
      .setIn(['currentActivity'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('TOGGLE_HISTORY_EDIT_MODE', () => {
    const mockAction = { type: types.TOGGLE_HISTORY_EDIT_MODE };
    const mockState = state
      .set('historyEdits', state.get('historyNotes'))
      .set('historyEditMode', !state.get('historyEditMode'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_HISTORY_TEXT', () => {
    const mockAction = { type: types.UPDATE_HISTORY_TEXT, payload: 'edits' };
    const mockState = state
      .set('historyEdits', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_HISTORY_UPDATES', () => {
    const mockAction = { type: types.SAVE_HISTORY_UPDATES };
    const mockState = state
      .set('historySaveLoading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_HISTORY_UPDATES_SUCCESS', () => {
    const mockAction = { type: types.SAVE_HISTORY_UPDATES_SUCCESS };
    const mockState = state
      .set('historyNotes', state.get('historyEdits'))
      .set('historyEditMode', !state.get('historyEditMode'))
      .set('historySaveLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_HISTORY_UPDATES_ERROR', () => {
    const mockAction = { type: types.SAVE_HISTORY_UPDATES_ERROR };
    const mockState = state
      .set('historySaveLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});
