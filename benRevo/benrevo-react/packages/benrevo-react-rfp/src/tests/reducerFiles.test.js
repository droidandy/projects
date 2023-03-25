import { fromJS, Map, List } from 'immutable';
import reducer from '../reducerFiles';
import {
  ADD_FILE,
  REMOVE_FILE_UI,
  ADD_PLAN_FILE,
  REMOVE_PLAN_FILE_UI,
  RFP_MEDICAL_SECTION,
} from '../constants';

describe('rfpReducer', () => {
  const baseState = {
    filesSummary: List([]),
    filesCensus: List([]),
    filesCurrentCarriers: List([]),
    planFiles: Map({}),
    filesClaims: List([]),
  };
  let state;
  beforeEach(() => {
    state = fromJS({
      common: Map({
        pdf: {},
        totalSize: 10485760,
        totalFiles: 10,
        currentSize: 0,
      }),
      medical: Map({
        ...baseState,
      }),
      dental: Map({
        ...baseState,
      }),
      vision: Map({
        ...baseState,
      }),
      life: Map({
        ...baseState,
      }),
      std: Map({
        ...baseState,
      }),
      ltd: Map({
        ...baseState,
      }),
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('ADD_FILE', () => {
    const mockAction = { type: ADD_FILE, payload: { files: [{ name: 'file', size: 1 }], name: 'filesSummary' }, meta: { section: RFP_MEDICAL_SECTION } };
    let list = state.get(mockAction.meta.section).get(mockAction.payload.name);
    list = list.push({ name: 'file', field: 'filesSummary', index: 0, size: 1, fieldName: 'filesSummary', section: mockAction.meta.section });
    const mockState = state
      .setIn([mockAction.meta.section, mockAction.payload.name], list);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REMOVE_FILE_UI', () => {
    const mockAction = { type: REMOVE_FILE_UI, payload: { index: 0, name: 'filesSummary' }, meta: { section: RFP_MEDICAL_SECTION } };
    let list = state.get(mockAction.meta.section).get('filesSummary');
    list = list.push('file');
    const mockState = state
      .setIn([mockAction.meta.section, mockAction.payload.name], list);
    expect(reducer(mockState, mockAction)).toEqual(state);
  });

  it('ADD_PLAN_FILE', () => {
    const mockAction = { type: ADD_PLAN_FILE, payload: { index: 0, files: [{ name: 'file', size: 1 }] }, meta: { section: RFP_MEDICAL_SECTION } };
    let plans = state.get(mockAction.meta.section).get('planFiles');

    plans = plans.set(mockAction.payload.index, List());

    let plan = plans.get(mockAction.payload.index);
    plan = plan.push(mockAction.payload.files[0]);
    plans = plans.setIn([mockAction.payload.index], plan);

    const mockState = state
      .setIn([mockAction.meta.section, 'planFiles'], plans);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REMOVE_PLAN_FILE_UI', () => {
    const mockAction = { type: REMOVE_PLAN_FILE_UI, payload: { index: 0, fileIndex: 0 }, meta: { section: RFP_MEDICAL_SECTION } };
    let plans = state.get(mockAction.meta.section).get('planFiles');
    plans = plans.set(mockAction.payload.index, List());
    let plan = plans.get(mockAction.payload.index);
    plan = plan.push('file');
    plans = plans.setIn([mockAction.payload.index], plan);

    const newState = state.setIn([mockAction.meta.section, 'planFiles', mockAction.payload.index], List());
    const mockState = state
      .setIn([mockAction.meta.section, 'planFiles'], plans);
    expect(reducer(mockState, mockAction)).toEqual(newState);
  });
});
