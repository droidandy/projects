import { fromJS } from 'immutable';
import * as types from './constants';
import * as appTypes from '../App/constants';

const initialState = fromJS({
  filters: {
    name: '',
  },
  rewards: [],
  loading: false,
  sort: {
    prop: 'recipientName',
    order: 'ascending',
  },
});

function rewardReducer(state = initialState, action) {
  switch (action.type) {
    case appTypes.CLEAR:
      return state
        .setIn(['rewards'], fromJS([]));
    case types.REWARDS_GET:
      return state
        .set('loading', true);
    case types.REWARDS_GET_SUCCESS: {
      const rewards = action.payload;
      return state
        .set('loading', false)
        .set('rewards', fromJS(rewards));
    }
    case types.REWARDS_GET_ERROR:
      return state
        .set('loading', false);
    case types.CHANGE_SORT: {
      const prop = action.payload.prop;
      let sort = state.get('sort');
      if (sort.get('prop') === prop) {
        if (sort.get('order') === 'ascending') sort = sort.set('order', 'descending');
        else {
          sort = sort.set('order', 'ascending');
        }
      } else {
        sort = sort.set('prop', prop).set('order', 'ascending');
      }

      return state
        .setIn(['sort'], sort);
    }
    case types.CHANGE_FILTER: {
      return state
        .setIn(['filters', action.payload.type], fromJS(action.payload.value));
    }
    default:
      return state;
  }
}

export default rewardReducer;
