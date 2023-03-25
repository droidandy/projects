import { reduce } from 'js/redux';
import update from 'update-js';

const initialState = {
  list: {
    items: [],
    pagination: {
      current: 1,
      pageSize: 10
    },
    query: {
      page: 1,
      search: ''
    },
    can: {},
    statistics: {}
  },
  currentStats: {},
  formData: {
    userRoles: [],
    memberRoles: [],
    companies: [],
    can: {}
  }
};

export default reduce('users', initialState, (reducer) => {
  reducer('setQuery', (state, query) => {
    if (query && query !== state.list.query) {
      return update(state, 'list.query', query);
    }
    return state;
  });

  reducer('getUsersSuccess', (state, data) => {
    return update.assign(state, 'list', data);
  });

  reducer('getFormDataSuccess', (state, formData) => {
    return { ...state, formData };
  });
});
