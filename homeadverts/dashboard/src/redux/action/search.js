import { batchActions } from 'redux-batched-actions';
import { messenger } from 'api';
import { search } from 'type';
import { roomSearchAction } from 'action/room';

export const userSearch = payload => ({ type: search.USER_SEARCH, payload });

export const userSearchClear = () => ({ type: search.USER_SEARCH_CLEAR });

export const clearSearch = () => (dispatch) => {
  dispatch(batchActions([
    userSearchClear(),
    roomSearchAction(''),
  ]));
};

export const searchUser = query => (dispatch) => {
  dispatch(roomSearchAction(query));
  if (query?.length >= 3) {
    messenger.searchUser(query).then((res) => {
      const result = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, obj] of Object.entries(res?.data)) {
        const items = obj.items.map(el => ({ ...el, type: 'search' }));
        result[key] = { items, total: items?.length };
      }
      dispatch(userSearch(result));
    });
  } else {
    dispatch(userSearchClear());
  }
};
