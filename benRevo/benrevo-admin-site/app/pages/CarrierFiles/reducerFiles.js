import { fromJS } from 'immutable';
import * as types from './constants';

const initialState = fromJS({
  files: [],
  tags: {},
});

function CarrierFilesReducerFiles(state = initialState, action) {
  switch (action.type) {
    case types.ADD_FILES: {
      let files = state.get('files');
      files = files.concat(action.payload.files);
      return state
        .setIn(['files'], files);
    }
    case types.REMOVE_FILE: {
      return state
        .deleteIn(['files', action.payload.index])
        .deleteIn(['tags', action.payload.index]);
    }
    case types.CHANGE_TAGS: {
      return state
        .setIn(['tags', action.payload.index], action.payload.tags);
    }
    case types.UPLOAD_FILE_SUCCESS: {
      return state
        .setIn(['files'], state.get('files').shift())
        .deleteIn(['tags', action.payload.index]);
    }
    case types.UPLOAD_FILE_ERROR: {
      return state
        .setIn(['files'], state.get('files').shift())
        .deleteIn(['tags', action.payload.index]);
    }
    default:
      return state;
  }
}

export default CarrierFilesReducerFiles;
