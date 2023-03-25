import { fromJS, List, Map } from 'immutable';
import {
  ADD_FILE,
  REMOVE_FILE_UI,
  ADD_PLAN_FILE,
  REMOVE_PLAN_FILE_UI,
  RESET_RFP_STATE,
  FETCH_RFP_PDF_SUCCESS,
  FETCH_RFP_PDF_ERROR,
  UPDATE_FILES,
  SEND_RFP_FILE_ERROR,
} from './constants';

const baseState = {
  filesSummary: List([]),
  filesCensus: List([]),
  filesCurrentCarriers: List([]),
  planFiles: Map({}),
  filesClaims: List([]),
};

export const initialState = fromJS({
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

function reducerFiles(state = initialState, action) {
  switch (action.type) {
    case ADD_FILE: {
      const payload = action.payload;
      const section = action.meta.section;
      // get current list of files
      let list = state.get(action.meta.section).get(payload.name);
      if (payload.files) {
        payload.files.map((item) => {
          /* eslint-disable no-param-reassign */
          item.fieldName = payload.name;
          item.section = action.meta.section;
          item.field = payload.name;
          item.index = list.size;
          // add new file in current list
          list = list.push(item);
          return true;
        });
      }

      return state
        .setIn([section, payload.name], list);
    }
    case REMOVE_FILE_UI: {
      return state
        .deleteIn([action.meta.section, action.payload.name, action.payload.index]);
    }
    case ADD_PLAN_FILE: {
      const payload = action.payload;
      let plans = state.get(action.meta.section).get('planFiles');

      if (!plans.has(payload.index)) {
        plans = plans.set(payload.index, List());
      }

      if (payload.files) {
        for (let i = 0; i < payload.files.length; i += 1) {
          let plan = plans.get(payload.index);
          const file = payload.files[i];
          file.section = action.meta.section;
          if (payload.index === 0) file.field = 'basePlan';
          else file.field = `Option_${payload.index}`;
          file.index = plan.size;
          plan = plan.push(file);
          plans = plans.setIn([payload.index], plan);
        }
      }

      return state
        .setIn([action.meta.section, 'planFiles'], plans);
    }
    case REMOVE_PLAN_FILE_UI: {
      return state
        .deleteIn([action.meta.section, 'planFiles', action.payload.index, action.payload.fileIndex]);
    }
    case UPDATE_FILES: {
      return action.payload;
    }
    case SEND_RFP_FILE_ERROR: {
      return state;
    }
    case FETCH_RFP_PDF_SUCCESS: {
      return state
        .setIn(['common', 'pdf'], action.payload);
    }
    case FETCH_RFP_PDF_ERROR: {
      return state;
    }
    case RESET_RFP_STATE:
      return initialState;
    default:
      return state;
  }
}

export default reducerFiles;
