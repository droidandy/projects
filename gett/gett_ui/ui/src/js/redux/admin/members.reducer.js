import { reduce } from 'js/redux';
import { map } from 'lodash';
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
  changeLog: [],
  currentStats: {},
  formData: {
    userRoles: [],
    memberRoles: [],
    companies: [],
    bookers: [],
    passengers: [],
    workRoles: [],
    departments: [],
    paymentCards: [],
    can: {},
    favoriteAddresses: [],
    changeLog: []
  },
  comments: []
};

export default reduce('members', initialState, (reducer) => {
  reducer('setQuery', (state, query) => {
    if (query && query !== state.list.query) {
      return update(state, 'list.query', query);
    }
    return state;
  });

  reducer('getMembersSuccess', (state, data) => {
    return update.assign(state, 'list', data);
  });

  reducer('getFormDataSuccess', (state, formData) => {
    return { ...state, formData };
  });

  reducer('getStats', (state) => {
    return { ...state, currentStats: initialState.currentStats };
  });

  reducer('getStatsSuccess', (state, currentStats) => {
    return { ...state, currentStats };
  });

  reducer('createFavoriteAddressSuccess', (state, favoriteAddress) => {
    return update.add(state, 'formData.favoriteAddresses', favoriteAddress);
  });

  reducer('updateFavoriteAddressSuccess', (state, favoriteAddress) => {
    return update(state, `formData.favoriteAddresses.{id:${favoriteAddress.id}}`, favoriteAddress);
  });

  reducer('destroyFavoriteAddressSuccess', (state, favoriteAddressId) => {
    return update.remove(state, `formData.favoriteAddresses.{id:${favoriteAddressId}}`);
  });

  reducer('destroyPaymentCardSuccess', (state, paymentCardId) => {
    return update.remove(state, `formData.paymentCards.{id:${paymentCardId}}`);
  });

  reducer('getLogSuccess', (state, changeLog) => {
    return { ...state, changeLog };
  });

  reducer('getCommentsSuccess', (state, comments) => {
    return { ...state, comments };
  });

  reducer('addComment', (state, comment) => {
    return update.add(state, 'comments', comment);
  });

  reducer('makeDefaultPaymentCardSuccess', (state, paymentCardId) => {
    return update.with(state, 'formData.paymentCards', (cards) => {
      return map(cards, card => ({ ...card, default: card.id === paymentCardId }));
    });
  });
});
