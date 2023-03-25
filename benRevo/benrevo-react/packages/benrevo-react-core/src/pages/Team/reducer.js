import { fromJS } from 'immutable';
import {
  FETCH_TEAM_SUCCEEDED,
  FETCH_TEAM_FAILED,
  FETCH_TEAM_MEMBERS,
  SAVE_TEAM_FAILED,
  UPDATE_TEAM,
  SAVE_TEAM_SUCCEEDED, SAVE_TEAM_MEMBERS,
  DELETE_TEAM_SUCCEEDED,
  DELETE_TEAM_FAILED,
} from './constants';

/*eslint-disable*/
export const initialState = fromJS({
  hasError: false,
  loading: false,
  members: [],
  selected: [],
});

function teamMemberReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TEAM:
      let member = action.payload.member.toJS();
      let selected = state.get('selected');
      let members = state.get('members');
      let add = true;

      selected.map((item, i) => {
        if (item.get('authId') === member.authId) {
          add = false;
          selected = selected.delete(i);
          return false;
        }

        return true;
      });

      if (add) {
        selected = selected.push(fromJS(member));
      }

      return state
        .setIn(['selected'], selected);
    case FETCH_TEAM_MEMBERS:
      return state
        .set('members', fromJS([]))
        .set('loading', true);
    case FETCH_TEAM_FAILED:
      return state
        .set('loading', false);
    case SAVE_TEAM_FAILED:
      return state
        .set('loading', false)
        .set('hasError', true);
    case FETCH_TEAM_SUCCEEDED: {
      action.payload.finalUsers.sort((a, b) => {
        if (a['authId'] < b['authId']) return -1;
        if (a['authId'] > b['authId']) return 1;
      });

      return state
        .set('members', fromJS(action.payload.finalUsers))
        .set('selected', fromJS(action.payload.selected))
        .set('hasError', false)
        .set('loading', false);
    }
    case SAVE_TEAM_MEMBERS:
      return state
        .set('loading', true);
    case SAVE_TEAM_SUCCEEDED:
      return state
        .set('loading', false)
        .set('hasError', false);
    case DELETE_TEAM_SUCCEEDED:
      return state
        .set('loading', false);
    case DELETE_TEAM_FAILED:
      return state
        .set('loading', false);
    default:
      return state;
  }
}

export default teamMemberReducer;
