import { fromJS } from 'immutable';
import * as types from './constants';
import { CARRIER } from '../../config';

const initialState = fromJS({
  files: [],
  loading: false,
  uploadingFiles: false,
  search: '',
  tagList: [],
  tag: 'All',
  carriers: [],
  selectedCarrier: {},
});

function CarrierFilesReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_CARRIERS: {
      const carriers = state.get('carriers');
      let selected = fromJS({});

      carriers.map((item) => {
        if (item.get('carrierId') === action.payload) {
          selected = item;
          return true;
        }

        return true;
      });

      return state
        .set('selectedCarrier', selected);
    }
    case types.LOAD_CARRIERS_SUCCESS: {
      const carriers = [];
      let selected = state.get('selectedCarrier').toJS();
      action.payload.map((item) => {
        if (
          (item.name === 'UHC' && CARRIER === 'UHC') ||
          ((item.name === 'ANTHEM_BLUE_CROSS' || item.name === 'ANTHEM_CLEAR_VALUE') && CARRIER === 'ANTHEM') ||
          (CARRIER === 'BENREVO')
        ) {
          if (!selected.carrierId) selected = item;
          carriers.push(item);
        }

        return true;
      });

      return state
        .set('selectedCarrier', fromJS(selected))
        .set('carriers', fromJS(carriers));
    }
    case types.CHANGE_SEARCH: {
      return state
        .setIn(['search'], action.payload);
    }
    case types.FILES_GET: {
      return state
        .setIn(['files'], (action.payload.showLoading) ? fromJS([]) : state.get('files'))
        .setIn(['loading'], (action.payload.showLoading) ? true : state.get('loading'));
    }
    case types.FILES_GET_SUCCESS: {
      return state
        .setIn(['files'], fromJS(action.payload.data))
        .setIn(['loading'], (action.payload.showLoading) ? false : state.get('loading'));
    }
    case types.FILES_GET_ERROR: {
      return state
        .setIn(['loading'], false);
    }
    case types.DELETE_FILE: {
      return state
        .deleteIn(['files', action.payload.index]);
    }
    case types.UPLOAD_FILES:
      return state
        .setIn(['uploadingFiles'], true);
    case types.UPLOAD_FILES_SUCCESS: {
      return state
        .setIn(['uploadingFiles'], false);
    }
    case types.UPLOAD_FILES_ERROR: {
      return state
        .setIn(['uploadingFiles'], false);
    }
    case types.CHANGE_SEARCH_TAG: {
      return state
        .setIn(['tag'], action.payload.tag);
    }
    case types.TAGS_GET_SUCCESS: {
      const tagList = action.payload;
      return state
        .setIn(['tagList'], fromJS(tagList));
    }
    default:
      return state;
  }
}

export default CarrierFilesReducer;
