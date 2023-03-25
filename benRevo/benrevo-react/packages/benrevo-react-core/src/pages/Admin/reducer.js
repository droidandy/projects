import { fromJS } from 'immutable';
import moment from 'moment';
import {
  DISCLOSURE_CANCEL,
  CHANGE_DISCLOSURE,
  DISCLOSURE_SUBMIT,
  DISCLOSURE_SUBMIT_SUCCESS,
  DISCLOSURE_SUBMIT_ERROR,
  GET_CONFIG,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_ERROR,
} from './constants';

export const initialState = fromJS({
  loading: false,
  configLoaded: false,
  disclosureOrigin: {
    data: '',
    modifyBy: '',
    modifyDate: '',
    type: 'LANGUAGE',
  },
  disclosure: {
    data: '',
    modifyBy: '',
    modifyDate: '',
    type: 'LANGUAGE',
  },
});

function AdminReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DISCLOSURE:
      return state
        .setIn(['disclosure', 'data'], action.payload.value);
    case DISCLOSURE_CANCEL:
      return state
        .setIn(['disclosure', 'data'], state.get('disclosureOrigin').get('data'));
    case DISCLOSURE_SUBMIT:
      return state
        .setIn(['disclosure', 'modifyDate'], moment().format())
        .setIn(['loading'], false);
    case DISCLOSURE_SUBMIT_SUCCESS:
      return state
        .setIn(['loading'], false);
    case DISCLOSURE_SUBMIT_ERROR:
      return state
        .setIn(['loading'], false);
    case GET_CONFIG:
      return state
        .setIn(['configLoaded'], false)
        .setIn(['loading'], true);
    case GET_CONFIG_SUCCESS:
      return state
        .setIn(['disclosureOrigin'], (action.payload.length) ? fromJS(action.payload[0]) : state.get('disclosureOrigin'))
        .setIn(['disclosure'], (action.payload.length) ? fromJS(action.payload[0]) : state.get('disclosure'))
        .setIn(['configLoaded'], true)
        .setIn(['loading'], false);
    case GET_CONFIG_ERROR:
      return state
        .setIn(['configLoaded'], true)
        .setIn(['loading'], false);
    default:
      return state;
  }
}

export default AdminReducer;
