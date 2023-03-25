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
    can: {}
  },
  details: {
    loading: true,
    record: {},
    stats: {}
  },
  formData: {
    passengers: [],
    workRoles: [],
    departments: [],
    can: {}
  },
  changeLog: []
};

export default reduce('bookers', initialState, (reducer) => {
  reducer('setQuery', (state, query) => {
    if (query && query !== state.list.query) {
      return update(state, 'list.query', query);
    }
    return state;
  });

  reducer('getBookersSuccess', (state, data) => {
    return update.assign(state, 'list', data);
  });

  reducer('getFormDataSuccess', (state, formData) => {
    return { ...state, formData };
  });

  reducer('getDetails', (state) => {
    return update(state, 'details', initialState.details);
  });

  reducer('getDetailsSuccess', (state, { record, stats }) => {
    return update(state, {
      'details.loading': false,
      'details.record': record,
      'details.stats': stats
    });
  });

  reducer('updateBookerSuccess', (state, booker) => {
    return update(state, 'details.record', booker);
  });

  reducer('getLogSuccess', (state, changeLog) => {
    return { ...state, changeLog };
  });

  reducer('toggleCurrentMemberBookerSuccess', (state, booker) => {
    return update(state, `list.items.{id:${booker.id}}`, booker);
  });
});
